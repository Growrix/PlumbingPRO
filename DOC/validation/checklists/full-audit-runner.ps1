param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "../../..")),
  [string]$OutputRoot = "DOC/output/runs",
  [switch]$CiMode
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function New-DirIfMissing {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Resolve-DocPattern {
  param(
    [string]$Pattern,
    [string]$Root
  )

  $patternFs = $Pattern -replace '/', '\\'

  if ($patternFs -match '\*\*') {
    $idx = $patternFs.IndexOf('**')
    $rootPart = $patternFs.Substring(0, $idx).TrimEnd('\\')
    $tail = $patternFs.Substring($idx + 2).TrimStart('\\')
    if ([string]::IsNullOrWhiteSpace($tail)) { $tail = '*' }

    $rootPath = Join-Path $Root $rootPart
    if (-not (Test-Path $rootPath)) { return @() }

    if ($tail -match '[\*\?]') {
      return @(Get-ChildItem -Path $rootPath -Recurse -Filter $tail -ErrorAction SilentlyContinue)
    }

    # When pattern includes ** and tail is a plain filename, resolve by recursive filename match.
    return @(Get-ChildItem -Path $rootPath -Recurse -Filter $tail -ErrorAction SilentlyContinue)
  }

  if ($patternFs -match '[\*\?]') {
    return @(Get-ChildItem -Path (Join-Path $Root $patternFs) -ErrorAction SilentlyContinue)
  }

  $exact = Join-Path $Root $patternFs
  if (Test-Path $exact) {
    return @((Get-Item $exact))
  }

  return @()
}

function Get-FrontmatterBlock {
  param([string]$FilePath)
  $raw = Get-Content $FilePath -Raw
  $m = [regex]::Match($raw, '(?s)^---\s*(.*?)\s*---')
  if ($m.Success) { return $m.Groups[1].Value }
  return ""
}

function Get-FrontmatterLoads {
  param([string]$FilePath)
  $fm = Get-FrontmatterBlock -FilePath $FilePath
  $loads = @()
  foreach ($line in ($fm -split "`n")) {
    if ($line -match '^\s*-\s*(DOC/[^\s#]+)') {
      $loads += $Matches[1].Trim()
    }
  }
  return $loads
}

function Find-FirstMatchLocation {
  param(
    [string]$FilePath,
    [string]$Pattern
  )

  $m = Select-String -Path $FilePath -Pattern $Pattern -SimpleMatch -AllMatches | Select-Object -First 1
  if (-not $m) { return "" }

  $rel = $m.Path
  if ($rel.StartsWith($RepoRoot)) {
    $rel = $rel.Substring($RepoRoot.Length).TrimStart('\\').Replace('\\','/')
  }
  return "${rel}:$($m.LineNumber)"
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$reportsDir = Join-Path $RepoRoot (Join-Path $OutputRoot "$timestamp/reports")
New-DirIfMissing -Path $reportsDir

$auditRun = [ordered]@{
  timestamp = (Get-Date).ToString("s")
  target_dir = (Join-Path $RepoRoot "DOC")
  mode = "AUDIT"
  fixture = $null
  meta_agent_version = "1"
  template_version = 1
}

$sectionOrder = @("A","B","C","D","E","F","G","H")
$sections = @{}
foreach ($s in $sectionOrder) {
  $sections[$s] = [ordered]@{
    name = ""
    status = "passed"
    blockers = 0
    advisories = 0
    checks = @()
  }
}
$sections["A"].name = "Inventory"
$sections["B"].name = "Reference integrity"
$sections["C"].name = "Schema compliance"
$sections["D"].name = "Wiring coverage"
$sections["E"].name = "Orphans"
$sections["F"].name = "Determinism"
$sections["G"].name = "Constraint evaluability"
$sections["H"].name = "End-to-end smoke"

$brokenRefs = @()
$inconsistencies = @()
$orphans = [ordered]@{
  skills_unreferenced = @()
  integrations_unreferenced = @()
  presets_unselectable = @()
  constraints_unloaded = @()
  spec_rules_unreferenced = @()
}

$checkStats = [ordered]@{
  total = 0
  pass = 0
  fail = 0
  na = 0
}
$blockerCount = 0
$advisoryCount = 0
$driftCount = 0

function Add-Check {
  param(
    [string]$Section,
    [string]$Id,
    [string]$Name,
    [ValidateSet("pass","fail","not-applicable")][string]$Status,
    [ValidateSet("blocker","advisory","drift","n/a")][string]$Severity,
    [string]$Evidence,
    [string]$Details = ""
  )

  $obj = [ordered]@{
    id = $Id
    name = $Name
    status = $Status
    severity = $Severity
    evidence = $Evidence
    details = $Details
  }

  $sections[$Section].checks += $obj
  $checkStats.total++

  if ($Status -eq "pass") {
    $checkStats.pass++
    return
  }

  if ($Status -eq "not-applicable") {
    $checkStats.na++
    return
  }

  $checkStats.fail++
  $sections[$Section].status = "failed"

  if ($Severity -eq "blocker") {
    $sections[$Section].blockers++
    $script:blockerCount++
  }
  elseif ($Severity -eq "advisory") {
    $sections[$Section].advisories++
    $script:advisoryCount++
  }
  elseif ($Severity -eq "drift") {
    $script:driftCount++
  }
}

# SECTION A
$requiredFolders = @(
  "DOC/core",
  "DOC/agents",
  "DOC/knowledge",
  "DOC/flows",
  "DOC/validation",
  "DOC/execution"
)
$missingFolders = @()
foreach ($folder in $requiredFolders) {
  if (-not (Test-Path (Join-Path $RepoRoot ($folder -replace '/','\\')))) {
    $missingFolders += $folder
  }
}
if ($missingFolders.Count -eq 0) {
  Add-Check -Section "A" -Id "A.1" -Name "Folder presence" -Status "pass" -Severity "n/a" -Evidence "Glob:DOC/<required-folders> -> all present"
}
else {
  Add-Check -Section "A" -Id "A.1" -Name "Folder presence" -Status "fail" -Severity "advisory" -Evidence "Glob:DOC/<required-folders> -> missing entries" -Details ($missingFolders -join ", ")
}

$minChecks = @(
  @{ Pattern = "DOC/agents/*.agent.md"; Min = 22 },
  @{ Pattern = "DOC/knowledge/integration-rules/**/*.yaml"; Min = 80 },
  @{ Pattern = "DOC/knowledge/integration-presets/*.yaml"; Min = 7 },
  @{ Pattern = "DOC/execution/spec-rules/*.md"; Min = 19 },
  @{ Pattern = "DOC/knowledge/architecture-templates/*.yaml"; Min = 5 }
)
$lowCounts = @()
foreach ($entry in $minChecks) {
  $count = @(Resolve-DocPattern -Pattern $entry.Pattern -Root $RepoRoot).Count
  if ($count -lt [int]$entry.Min) {
    $lowCounts += "$($entry.Pattern):$count/$($entry.Min)"
  }
}
if ($lowCounts.Count -eq 0) {
  Add-Check -Section "A" -Id "A.2" -Name "Folder count minimums" -Status "pass" -Severity "n/a" -Evidence "Glob count checks -> all above minimum"
}
else {
  Add-Check -Section "A" -Id "A.2" -Name "Folder count minimums" -Status "fail" -Severity "advisory" -Evidence "Glob count checks -> below minimum found" -Details ($lowCounts -join "; ")
}

$requiredFiles = @(
  "DOC/core/system-rules.md",
  "DOC/core/anti-hallucination-rules.md",
  "DOC/core/planning-principles.md",
  "DOC/agents/master_planner.agent.md",
  "DOC/agents/intake_strategist.agent.md",
  "DOC/agents/integration_planner.agent.md",
  "DOC/agents/reviewer.agent.md",
  "DOC/agents/_index.md",
  "DOC/knowledge/integration-rules/_index.md",
  "DOC/knowledge/integration-rules/_schema.md",
  "DOC/knowledge/integration-rules/_meta/role-matrix.json",
  "DOC/knowledge/feature-maps/feature-integration-map.json",
  "DOC/knowledge/automation-rules/automation-rules.md",
  "DOC/knowledge/automation-rules/outbound-event-taxonomy.md",
  "DOC/knowledge/automation-rules/outbound-webhook-signing.md",
  "DOC/knowledge/skills/_index.md",
  "DOC/knowledge/support-tools/_index.md",
  "DOC/validation/audit-template.md",
  "DOC/validation/audit-report.template.md",
  "DOC/validation/constraints/constraints.md",
  "DOC/validation/constraints/integration-constraints.md"
)
$missingRequired = @()
foreach ($f in $requiredFiles) {
  if (-not (Test-Path (Join-Path $RepoRoot ($f -replace '/','\\')))) {
    $missingRequired += $f
  }
}
if ($missingRequired.Count -eq 0) {
  Add-Check -Section "A" -Id "A.3" -Name "Required named files" -Status "pass" -Severity "n/a" -Evidence "Read:required canonical files -> all readable"
}
else {
  Add-Check -Section "A" -Id "A.3" -Name "Required named files" -Status "fail" -Severity "blocker" -Evidence "Read:required canonical files -> missing entries" -Details ($missingRequired -join ", ")
}

$docFiles = Get-ChildItem -Path (Join-Path $RepoRoot "DOC") -Recurse -File
$unexpected = @()
foreach ($f in $docFiles) {
  $rel = $f.FullName.Substring((Join-Path $RepoRoot "DOC").Length + 1).Replace('\','/')
  if (-not (
      $rel.StartsWith("core/") -or
      $rel.StartsWith("agents/") -or
      $rel.StartsWith("knowledge/") -or
      $rel.StartsWith("flows/") -or
      $rel.StartsWith("validation/") -or
      $rel.StartsWith("execution/") -or
      $rel.StartsWith("output/") -or
      $rel -eq "README.md"
    )) {
    $unexpected += $rel
  }
}
if ($unexpected.Count -eq 0) {
  Add-Check -Section "A" -Id "A.4" -Name "Drift scan" -Status "pass" -Severity "n/a" -Evidence "Glob:DOC/**/* -> no unexpected top-level namespaces"
}
else {
  Add-Check -Section "A" -Id "A.4" -Name "Drift scan" -Status "fail" -Severity "drift" -Evidence "Glob:DOC/**/* -> unexpected files found" -Details ($unexpected -join ", ")
}

# SECTION B
$agentFiles = Get-ChildItem -Path (Join-Path $RepoRoot "DOC/agents") -Filter *.agent.md
$badLoads = @()
foreach ($agentFile in $agentFiles) {
  $loads = Get-FrontmatterLoads -FilePath $agentFile.FullName
  foreach ($load in $loads) {
    $resolved = Resolve-DocPattern -Pattern $load -Root $RepoRoot
    if (@($resolved).Count -eq 0) {
      $badLoads += "$($agentFile.Name)::$load"
      $brokenRefs += [ordered]@{ source = "DOC/agents/$($agentFile.Name)"; expected_target = $load; actual = "empty_glob"; section_check = "B.1" }
    }
  }
}
if ($badLoads.Count -eq 0) {
  Add-Check -Section "B" -Id "B.1" -Name "Agent loads resolve" -Status "pass" -Severity "n/a" -Evidence "Glob:loads in DOC/agents/*.agent.md -> all resolved"
}
else {
  Add-Check -Section "B" -Id "B.1" -Name "Agent loads resolve" -Status "fail" -Severity "blocker" -Evidence "Glob:loads in DOC/agents/*.agent.md -> unresolved patterns" -Details ($badLoads -join "; ")
}

$presetFiles = Get-ChildItem -Path (Join-Path $RepoRoot "DOC/knowledge/integration-presets") -Filter *.yaml
$presetMap = @()
$presetMissing = @()
foreach ($preset in $presetFiles) {
  $state = ""
  foreach ($line in (Get-Content $preset.FullName)) {
    if ($line -match '^integrations:\s*$') { $state = "integrations"; continue }
    if ($line -match '^[A-Za-z_]+:\s*$') { if ($state -ne "") { $state = "" }; continue }
    if ($state -eq "integrations" -and $line -match '^\s+[a-z_]+:\s*([a-z0-9\-]+)\s*$') {
      $name = $Matches[1]
      $resolved = Resolve-DocPattern -Pattern "DOC/knowledge/integration-rules/**/$name.yaml" -Root $RepoRoot
      if (@($resolved).Count -ne 1) {
        $presetMissing += "$($preset.Name)::$name"
        $brokenRefs += [ordered]@{ source = "DOC/knowledge/integration-presets/$($preset.Name)"; expected_target = "DOC/knowledge/integration-rules/**/$name.yaml"; actual = "not_found_or_ambiguous"; section_check = "B.2" }
      }
      else {
        $presetMap += [ordered]@{ preset = $preset.Name; integration = $name; file = $resolved[0].FullName }
      }
    }
  }
}
if ($presetMissing.Count -eq 0) {
  Add-Check -Section "B" -Id "B.2" -Name "Preset integrations resolve" -Status "pass" -Severity "n/a" -Evidence "Glob:integration names from presets -> exactly one YAML each"
}
else {
  Add-Check -Section "B" -Id "B.2" -Name "Preset integrations resolve" -Status "fail" -Severity "blocker" -Evidence "Glob:integration names from presets -> missing/ambiguous" -Details ($presetMissing -join "; ")
}

$skillMissing = @()
$integrationFiles = Get-ChildItem -Path (Join-Path $RepoRoot "DOC/knowledge/integration-rules") -Recurse -Filter *.yaml
foreach ($intFile in $integrationFiles) {
  $state = ""
  foreach ($line in (Get-Content $intFile.FullName)) {
    if ($line -match '^required_skills:\s*$') { $state = "skills"; continue }
    if ($line -match '^[A-Za-z_]+:\s*$') { if ($state -eq "skills") { $state = "" }; continue }
    if ($state -eq "skills" -and $line -match '^\s*-\s*([^#\s]+)\s*$') {
      $skill = $Matches[1]
      $skillPath = Join-Path $RepoRoot ("DOC/knowledge/skills/$skill.md")
      if (-not (Test-Path $skillPath)) {
        $skillMissing += "$($intFile.Name)::$skill"
        $brokenRefs += [ordered]@{ source = ("DOC/knowledge/integration-rules/" + $intFile.Name); expected_target = "DOC/knowledge/skills/$skill.md"; actual = "not_found"; section_check = "B.3" }
      }
    }
  }
}
if ($skillMissing.Count -eq 0) {
  Add-Check -Section "B" -Id "B.3" -Name "required_skills resolve" -Status "pass" -Severity "n/a" -Evidence "Glob:required_skills from integration YAMLs -> all files exist"
}
else {
  Add-Check -Section "B" -Id "B.3" -Name "required_skills resolve" -Status "fail" -Severity "blocker" -Evidence "Glob:required_skills from integration YAMLs -> missing skill files" -Details ($skillMissing -join "; ")
}

$taxonomyFile = Join-Path $RepoRoot "DOC/knowledge/automation-rules/outbound-event-taxonomy.md"
$taxonomy = @((Get-Content $taxonomyFile | Select-String -Pattern '^\| `([^`]+)` \|' -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique)
$badEvents = @()
foreach ($intFile in $integrationFiles) {
  $state = ""
  foreach ($line in (Get-Content $intFile.FullName)) {
    if ($line -match '^emits_outbound_events:\s*$') { $state = "events"; continue }
    if ($line -match '^[A-Za-z_]+:\s*$') { if ($state -eq "events") { $state = "" }; continue }
    if ($state -eq "events" -and $line -match '^\s*-\s*([a-z0-9\._-]+)\s*$') {
      $evt = $Matches[1]
      if ($taxonomy -notcontains $evt) {
        $badEvents += "$($intFile.Name)::$evt"
        $inconsistencies += [ordered]@{ kind = "event_orphan"; location = "DOC/knowledge/integration-rules/$($intFile.Name)"; description = "Outbound event $evt missing from taxonomy"; severity = "blocker" }
      }
    }
  }
}
if ($badEvents.Count -eq 0) {
  Add-Check -Section "B" -Id "B.4" -Name "emits_outbound_events in taxonomy" -Status "pass" -Severity "n/a" -Evidence "Read:taxonomy + integration events -> no orphan events"
}
else {
  Add-Check -Section "B" -Id "B.4" -Name "emits_outbound_events in taxonomy" -Status "fail" -Severity "blocker" -Evidence "Read:taxonomy + integration events -> orphan events found" -Details ($badEvents -join "; ")
}

$reviewerPath = Join-Path $RepoRoot "DOC/agents/reviewer.agent.md"
$reviewerText = Get-Content $reviewerPath -Raw
$idMatches = [regex]::Matches($reviewerText, '\b(?:C|F|SC|PC|DC|TC|AC|I)\d+\b') | ForEach-Object { $_.Value } | Sort-Object -Unique
$prefixFile = @{
  "C"  = "DOC/validation/constraints/constraints.md"
  "F"  = "DOC/validation/constraints/frontend-constraints.md"
  "SC" = "DOC/validation/constraints/security-constraints.md"
  "PC" = "DOC/validation/constraints/performance-constraints.md"
  "DC" = "DOC/validation/constraints/data-constraints.md"
  "TC" = "DOC/validation/constraints/testing-constraints.md"
  "AC" = "DOC/validation/constraints/accessibility-constraints.md"
  "I"  = "DOC/validation/constraints/integration-constraints.md"
}
$undefinedIds = @()
foreach ($id in $idMatches) {
  $prefix = if ($id.StartsWith("SC") -or $id.StartsWith("PC") -or $id.StartsWith("DC") -or $id.StartsWith("TC") -or $id.StartsWith("AC")) { $id.Substring(0,2) } else { $id.Substring(0,1) }
  if (-not $prefixFile.ContainsKey($prefix)) { continue }
  $cFile = Join-Path $RepoRoot ($prefixFile[$prefix] -replace '/','\\')
  if (-not (Select-String -Path $cFile -Pattern ("\b" + [regex]::Escape($id) + "\b") -Quiet)) {
    $undefinedIds += "$id::$($prefixFile[$prefix])"
  }
}
if ($undefinedIds.Count -eq 0) {
  Add-Check -Section "B" -Id "B.5" -Name "Reviewer constraint IDs resolve" -Status "pass" -Severity "n/a" -Evidence "Grep:IDs in reviewer -> all defined in matching constraint files"
}
else {
  Add-Check -Section "B" -Id "B.5" -Name "Reviewer constraint IDs resolve" -Status "fail" -Severity "blocker" -Evidence "Grep:IDs in reviewer -> undefined IDs found" -Details ($undefinedIds -join "; ")
}

$missingChecklists = @()
foreach ($agentFile in $agentFiles) {
  $raw = Get-Content $agentFile.FullName -Raw
  $checklistRefs = [regex]::Matches($raw, 'DOC/validation/checklists/[A-Za-z0-9._\-]+') | ForEach-Object { $_.Value } | Sort-Object -Unique
  foreach ($m in $checklistRefs) {
    $full = Join-Path $RepoRoot ($m -replace '/','\\')
    if (-not (Test-Path $full)) {
      $missingChecklists += "$($agentFile.Name)::$m"
      $brokenRefs += [ordered]@{ source = "DOC/agents/$($agentFile.Name)"; expected_target = $m; actual = "not_found"; section_check = "B.6" }
    }
  }
}
if ($missingChecklists.Count -eq 0) {
  Add-Check -Section "B" -Id "B.6" -Name "Checklist references resolve" -Status "pass" -Severity "n/a" -Evidence "Read:agent checklist refs -> all files exist"
}
else {
  Add-Check -Section "B" -Id "B.6" -Name "Checklist references resolve" -Status "fail" -Severity "blocker" -Evidence "Read:agent checklist refs -> missing files" -Details ($missingChecklists -join "; ")
}

$featureMap = Get-Content (Join-Path $RepoRoot "DOC/knowledge/feature-maps/feature-integration-map.json") -Raw | ConvertFrom-Json
$featureRefIssues = @()
foreach ($prop in $featureMap.features.PSObject.Properties) {
  $feature = $prop.Name
  $primary = $prop.Value.primary
  $secondary = @($prop.Value.secondary)
  $allRefs = @($primary) + $secondary
  foreach ($ref in $allRefs) {
    if ([string]::IsNullOrWhiteSpace($ref)) { continue }
    $resolved = Resolve-DocPattern -Pattern "DOC/knowledge/integration-rules/**/$ref.yaml" -Root $RepoRoot

    # Allow virtual/platform aliases documented in feature map guidance.
    if ($ref -in @("database")) {
      continue
    }

    if (@($resolved).Count -ne 1) {
      $featureRefIssues += "$feature::$ref"
      $brokenRefs += [ordered]@{ source = "DOC/knowledge/feature-maps/feature-integration-map.json"; expected_target = "DOC/knowledge/integration-rules/**/$ref.yaml"; actual = "not_found_or_ambiguous"; section_check = "B.7" }
    }
  }
}
if ($featureRefIssues.Count -eq 0) {
  Add-Check -Section "B" -Id "B.7" -Name "Feature map integrations resolve" -Status "pass" -Severity "n/a" -Evidence "Read:feature-integration-map + Glob integration YAMLs -> all resolved"
}
else {
  Add-Check -Section "B" -Id "B.7" -Name "Feature map integrations resolve" -Status "fail" -Severity "blocker" -Evidence "Read:feature-integration-map + Glob integration YAMLs -> unresolved values" -Details ($featureRefIssues -join "; ")
}

$masterPath = Join-Path $RepoRoot "DOC/agents/master_planner.agent.md"
$masterRaw = Get-Content $masterPath -Raw
$agentNameMatches = [regex]::Matches($masterRaw, '\b(intake_strategist|integration_planner|frontend_planner|backend_planner|devops_planner|qa_planner|security_auditor|performance_auditor|reviewer|execution_orchestrator|spec_writer|diagram_writer|openapi_writer|adr_writer|runbook_writer)\b') | ForEach-Object { $_.Value } | Sort-Object -Unique
$missingAgentsFromMaster = @()
foreach ($agentName in $agentNameMatches) {
  $ap = Join-Path $RepoRoot "DOC/agents/$agentName.agent.md"
  if (-not (Test-Path $ap)) {
    $missingAgentsFromMaster += $agentName
    $brokenRefs += [ordered]@{ source = "DOC/agents/master_planner.agent.md"; expected_target = "DOC/agents/$agentName.agent.md"; actual = "not_found"; section_check = "B.8" }
  }
}
if ($missingAgentsFromMaster.Count -eq 0) {
  Add-Check -Section "B" -Id "B.8" -Name "master_planner referenced agents exist" -Status "pass" -Severity "n/a" -Evidence "Read:master_planner workflow -> all referenced agents exist"
}
else {
  Add-Check -Section "B" -Id "B.8" -Name "master_planner referenced agents exist" -Status "fail" -Severity "blocker" -Evidence "Read:master_planner workflow -> missing agents" -Details ($missingAgentsFromMaster -join ", ")
}

# SECTION C
$requiredIntegrationFields = @("integration","category","role","tier","default_for_archetypes","alternatives","cost_band","compliance_tags","boundary","required_skills","runbook","setup_steps","constraints","common_failures","env_vars")
$integrationFieldIssues = @()
foreach ($intFile in $integrationFiles) {
  $raw = Get-Content $intFile.FullName -Raw
  $isStub = [regex]::IsMatch($raw, '(?m)^status:\s*stub\s*$')
  $mustHave = if ($isStub) { @("integration","category","role","tier","status") } else { $requiredIntegrationFields }
  $missing = @()
  foreach ($f in $mustHave) {
    if ($f -eq "env_vars") {
      # Accept either env_vars: or required_env_vars: as the environment variables declaration
      $hasEnvVars = [regex]::IsMatch($raw, "(?m)^env_vars:") -or [regex]::IsMatch($raw, "(?m)^required_env_vars:")
      if (-not $hasEnvVars) { $missing += $f }
    }
    elseif (-not [regex]::IsMatch($raw, "(?m)^" + [regex]::Escape($f) + ":")) {
      $missing += $f
    }
  }
  if ($missing.Count -gt 0) {
    $integrationFieldIssues += "$($intFile.Name)::" + ($missing -join ',')
  }
}
if ($integrationFieldIssues.Count -eq 0) {
  Add-Check -Section "C" -Id "C.1" -Name "Integration YAML required fields" -Status "pass" -Severity "n/a" -Evidence "Read:integration YAML field checks -> all valid"
}
else {
  Add-Check -Section "C" -Id "C.1" -Name "Integration YAML required fields" -Status "fail" -Severity "advisory" -Evidence "Read:integration YAML field checks -> missing fields found" -Details ($integrationFieldIssues -join "; ")
}

$presetKeyIssues = @()
foreach ($preset in $presetFiles) {
  $raw = Get-Content $preset.FullName -Raw
  $requiredPresetKeys = @("preset:","applies_to:","integrations:","forbidden:","optional:","automation_surface:")
  $missing = @()
  foreach ($k in $requiredPresetKeys) {
    if ($raw -notmatch [regex]::Escape($k)) {
      $missing += $k.TrimEnd(':')
    }
  }
  if ($raw -notmatch '(?m)^\s+archetype:\s*') { $missing += "applies_to.archetype" }
  if ($raw -notmatch '(?m)^\s+tier_band:\s*') { $missing += "applies_to.tier_band" }
  if ($missing.Count -gt 0) {
    $presetKeyIssues += "$($preset.Name)::" + ($missing -join ',')
  }
}
if ($presetKeyIssues.Count -eq 0) {
  Add-Check -Section "C" -Id "C.2" -Name "Preset YAML required keys" -Status "pass" -Severity "n/a" -Evidence "Read:presets -> required keys all present"
}
else {
  Add-Check -Section "C" -Id "C.2" -Name "Preset YAML required keys" -Status "fail" -Severity "blocker" -Evidence "Read:presets -> missing required keys" -Details ($presetKeyIssues -join "; ")
}

$agentSchemaIssues = @()
$requiredSections = @("## ROLE","## RESPONSIBILITIES","## STRICT RULES","## INPUT FORMAT","## WORKFLOW","## OUTPUT FORMAT","## VALIDATION STEPS","## FAILURE MODES")
foreach ($agent in $agentFiles) {
  $raw = Get-Content $agent.FullName -Raw
  $fm = Get-FrontmatterBlock -FilePath $agent.FullName
  $missingSchema = @()
  if ($fm -notmatch '(?m)^agent:\s*') { $missingSchema += "agent" }
  if ($fm -notmatch '(?m)^version:\s*') { $missingSchema += "version" }
  if ($fm -notmatch '(?m)^loads:\s*') { $missingSchema += "loads" }

  $missingSections = @()
  foreach ($sec in $requiredSections) {
    if ($raw -notmatch [regex]::Escape($sec)) { $missingSections += $sec }
  }

  if ($missingSchema.Count -gt 0 -or $missingSections.Count -gt 0) {
    $agentSchemaIssues += "$($agent.Name)::missing_frontmatter=[$($missingSchema -join ',')] missing_sections=[$($missingSections -join ',')]"
  }
}
if ($agentSchemaIssues.Count -eq 0) {
  Add-Check -Section "C" -Id "C.3" -Name "Agent frontmatter/body schema" -Status "pass" -Severity "n/a" -Evidence "Read:DOC/agents/*.agent.md -> frontmatter + required sections present"
}
else {
  Add-Check -Section "C" -Id "C.3" -Name "Agent frontmatter/body schema" -Status "fail" -Severity "advisory" -Evidence "Read:DOC/agents/*.agent.md -> schema/section gaps found" -Details ($agentSchemaIssues -join "; ")
}

$stubPrimaries = @()
$integrationIndexRaw = Get-Content (Join-Path $RepoRoot "DOC/knowledge/integration-rules/_index.md") -Raw
foreach ($entry in $presetMap) {
  $raw = Get-Content $entry.file -Raw
  if ($raw -match '(?m)^status:\s*stub\s*$') {
    # Check if the stub integration is cataloged in _index.md (infrastructure stub)
    $isCataloged = $integrationIndexRaw -match ("\b" + [regex]::Escape($entry.integration) + "\b")
    if (-not $isCataloged) {
      $stubPrimaries += "$($entry.preset)::$($entry.integration)"
      $inconsistencies += [ordered]@{ kind = "tier_mismatch"; location = "DOC/knowledge/integration-presets/$($entry.preset)"; description = "Stub integration selected as primary: $($entry.integration)"; severity = "blocker" }
    }
  }
}
if ($stubPrimaries.Count -eq 0) {
  $plannerRaw = Get-Content (Join-Path $RepoRoot "DOC/agents/integration_planner.agent.md") -Raw
  $guarded = ($plannerRaw -match 'STUB_AS_PRIMARY') -and ($plannerRaw -match 'TIER_BAND_MISMATCH')
  if ($guarded) {
    Add-Check -Section "C" -Id "C.4" -Name "Stub-as-primary forbidden" -Status "pass" -Severity "n/a" -Evidence "Read:presets + integration status + _index.md catalog -> all stub primaries are cataloged and STUB_AS_PRIMARY guard enforced"
  }
  else {
    Add-Check -Section "C" -Id "C.4" -Name "Stub-as-primary forbidden" -Status "pass" -Severity "n/a" -Evidence "Read:presets + integration status -> no uncataloged stub primary selections"
  }
}
else {
  $plannerRaw = Get-Content (Join-Path $RepoRoot "DOC/agents/integration_planner.agent.md") -Raw
  $guarded = ($plannerRaw -match 'STUB_AS_PRIMARY') -and ($plannerRaw -match 'TIER_BAND_MISMATCH')

  if ($guarded) {
    Add-Check -Section "C" -Id "C.4" -Name "Stub-as-primary forbidden" -Status "fail" -Severity "advisory" -Evidence "Read:uncataloged stub primaries detected; planner guard STUB_AS_PRIMARY/TIER_BAND_MISMATCH is enforced" -Details ($stubPrimaries -join "; ")
  }
  else {
    Add-Check -Section "C" -Id "C.4" -Name "Stub-as-primary forbidden" -Status "fail" -Severity "blocker" -Evidence "Read:presets + integration status -> uncataloged stub primary found and no guard enforcement" -Details ($stubPrimaries -join "; ")
  }
}

$specFiles = Get-ChildItem -Path (Join-Path $RepoRoot "DOC/execution/spec-rules") -Filter *.md
$specIssues = @()
foreach ($spec in $specFiles) {
  $head = (Get-Content $spec.FullName -TotalCount 50) -join "`n"
  if (($head -notmatch '^---') -and ($head -notmatch '(?m)^#\s+')) {
    $specIssues += $spec.Name
  }
}
if ($specIssues.Count -eq 0) {
  Add-Check -Section "C" -Id "C.5" -Name "Spec-rule template structure" -Status "pass" -Severity "n/a" -Evidence "Read:DOC/execution/spec-rules/*.md first 50 lines -> structured"
}
else {
  Add-Check -Section "C" -Id "C.5" -Name "Spec-rule template structure" -Status "fail" -Severity "advisory" -Evidence "Read:spec-rule files -> missing heading/frontmatter" -Details ($specIssues -join ", ")
}

# SECTION D
if ($missingAgentsFromMaster.Count -eq 0) {
  Add-Check -Section "D" -Id "D.1" -Name "master_planner workflow agents exist" -Status "pass" -Severity "n/a" -Evidence "Reused from B.8 -> all workflow agents exist"
}
else {
  Add-Check -Section "D" -Id "D.1" -Name "master_planner workflow agents exist" -Status "fail" -Severity "blocker" -Evidence "Reused from B.8 -> missing workflow agents" -Details ($missingAgentsFromMaster -join ", ")
}

$runsOrderIssues = @()
foreach ($agent in $agentFiles) {
  $fm = Get-FrontmatterBlock -FilePath $agent.FullName
  $inKey = ""
  foreach ($line in ($fm -split "`n")) {
    if ($line -match '^\s*runs_before:\s*$') { $inKey = "runs_before"; continue }
    if ($line -match '^\s*runs_after:\s*$') { $inKey = "runs_after"; continue }
    if ($line -match '^\s*[a-z_]+:\s*$') { $inKey = ""; continue }
    if ($inKey -in @("runs_before","runs_after") -and $line -match '^\s*-\s*([a-z_]+)\s*$') {
      $ref = $Matches[1]
      if (-not (Test-Path (Join-Path $RepoRoot "DOC/agents/$ref.agent.md"))) {
        $runsOrderIssues += "$($agent.Name)::$inKey->$ref"
      }
    }
  }
}
if ($runsOrderIssues.Count -eq 0) {
  Add-Check -Section "D" -Id "D.2" -Name "runs_before/runs_after consistency" -Status "pass" -Severity "n/a" -Evidence "Read:agent frontmatter runs_before/runs_after -> all references resolve"
}
else {
  Add-Check -Section "D" -Id "D.2" -Name "runs_before/runs_after consistency" -Status "fail" -Severity "blocker" -Evidence "Read:agent frontmatter runs_before/runs_after -> unresolved refs" -Details ($runsOrderIssues -join "; ")
}

$reviewerLoads = Get-FrontmatterLoads -FilePath $reviewerPath
$constraintFiles = Get-ChildItem -Path (Join-Path $RepoRoot "DOC/validation/constraints") -Filter *.md | ForEach-Object { "DOC/validation/constraints/" + $_.Name }
$unloadedConstraints = @()
foreach ($cf in $constraintFiles) {
  if ($reviewerLoads -notcontains $cf) {
    $unloadedConstraints += $cf
    $orphans.constraints_unloaded += $cf
  }
}
if ($unloadedConstraints.Count -eq 0) {
  Add-Check -Section "D" -Id "D.3" -Name "reviewer loads all constraints" -Status "pass" -Severity "n/a" -Evidence "Read:reviewer loads vs constraints/*.md -> complete"
}
else {
  Add-Check -Section "D" -Id "D.3" -Name "reviewer loads all constraints" -Status "fail" -Severity "blocker" -Evidence "Read:reviewer loads vs constraints/*.md -> missing loads" -Details ($unloadedConstraints -join ", ")
}

$indexPath = Join-Path $RepoRoot "DOC/agents/_index.md"
$indexRaw = Get-Content $indexPath -Raw
$requiredPlanKeys = @("frontend","backend","devops","testing","security","performance","integrations","automation","support_stack","data_flows","env_vars","webhooks")
$missingPlanMap = @()
foreach ($k in $requiredPlanKeys) {
  if ($indexRaw -notmatch ('\|\s*`' + [regex]::Escape($k) + '`\s*\|\s*[^|]+\|')) {
    $missingPlanMap += $k
  }
}
if ($missingPlanMap.Count -eq 0) {
  Add-Check -Section "D" -Id "D.4" -Name "plan.json key producer mapping" -Status "pass" -Severity "n/a" -Evidence "Read:DOC/agents/_index.md output artifact map -> required plan keys mapped"
}
else {
  Add-Check -Section "D" -Id "D.4" -Name "plan.json key producer mapping" -Status "fail" -Severity "blocker" -Evidence "Read:DOC/agents/_index.md output artifact map -> missing plan key rows" -Details ($missingPlanMap -join ", ")
}

$frontendOutputRootContracts = @(
  @{ Path = "DOC/core/system-rules.md"; Required = @("DOC/output/runs/<timestamp>/"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/output/README.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/master_planner.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/frontend_planner.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/ux_director.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/design_system_planner.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/component_system_planner.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/content_planner.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/motion_planner.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/interaction_planner.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/agents/page_planner.agent.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/execution/spec-rules/master-ui-architecture-spec.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/execution/spec-rules/design-system-spec.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/execution/spec-rules/component-system-spec.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/execution/spec-rules/content-library-spec.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/execution/spec-rules/motion-system-spec.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/execution/spec-rules/per-component-spec.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/execution/spec-rules/per-page-spec.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/knowledge/frontend-rules/content-rules.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/knowledge/frontend-rules/design-tokens-rules.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/knowledge/frontend-rules/motion-rules.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/knowledge/frontend-rules/page-archetype-rules.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/validation/constraints/frontend-constraints.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend", "<output_root>"); Forbidden = @("docs/frontend") },
  @{ Path = "DOC/validation/checklists/execution-acceptance-checklist.md"; Required = @("DOC/output/runs/<timestamp>/planning/frontend"); Forbidden = @("docs/frontend") }
)

$frontendOutputRootIssues = @()
foreach ($entry in $frontendOutputRootContracts) {
  $fullPath = Join-Path $RepoRoot ($entry.Path -replace '/','\\')
  if (-not (Test-Path $fullPath)) {
    $frontendOutputRootIssues += "$($entry.Path)::missing_file"
    continue
  }

  foreach ($pattern in $entry.Required) {
    if (-not (Select-String -Path $fullPath -Pattern $pattern -SimpleMatch -Quiet)) {
      $frontendOutputRootIssues += "$($entry.Path)::missing_required=$pattern"
    }
  }

  foreach ($pattern in $entry.Forbidden) {
    if (Select-String -Path $fullPath -Pattern $pattern -SimpleMatch -Quiet) {
      $frontendOutputRootIssues += "$($entry.Path)::forbidden_pattern=$pattern"
    }
  }
}

if ($frontendOutputRootIssues.Count -eq 0) {
  Add-Check -Section "D" -Id "D.5" -Name "Frontend planning output root contract" -Status "pass" -Severity "n/a" -Evidence "Read:frontend planning chain output locations -> canonical DOC/output run root enforced"
}
else {
  Add-Check -Section "D" -Id "D.5" -Name "Frontend planning output root contract" -Status "fail" -Severity "blocker" -Evidence "Read:frontend planning chain output locations -> contract gaps found" -Details ($frontendOutputRootIssues -join "; ")
}

# SECTION E
$skillIndexPath = Join-Path $RepoRoot "DOC/knowledge/skills/_index.md"
$skillIndexRows = Select-String -Path $skillIndexPath -Pattern '^\|\s*([a-z0-9\-]+)\s*\|' | ForEach-Object { $_.Matches[0].Groups[1].Value } | Sort-Object -Unique
$referencedSkills = @()
foreach ($intFile in $integrationFiles) {
  $state = ""
  foreach ($line in (Get-Content $intFile.FullName)) {
    if ($line -match '^required_skills:\s*$') { $state = "skills"; continue }
    if ($line -match '^[A-Za-z_]+:\s*$') { if ($state -eq "skills") { $state = "" }; continue }
    if ($state -eq "skills" -and $line -match '^\s*-\s*([^#\s]+)\s*$') {
      $referencedSkills += $Matches[1]
    }
  }
}
# Also scan agent files' loads: blocks for skill file references (e.g. DOC/knowledge/skills/<slug>.md)
foreach ($agent in $agentFiles) {
  foreach ($line in (Get-Content $agent.FullName)) {
    if ($line -match 'DOC/knowledge/skills/([a-z0-9\-]+)\.md') {
      $referencedSkills += $Matches[1]
    }
  }
}
$referencedSkills = $referencedSkills | Sort-Object -Unique
$unusedSkills = @()
foreach ($s in $skillIndexRows) {
  if ($s -in @("Slug","---")) { continue }
  if ($referencedSkills -notcontains $s) { $unusedSkills += $s }
}
if ($unusedSkills.Count -eq 0) {
  Add-Check -Section "E" -Id "E.1" -Name "Skills are referenced" -Status "pass" -Severity "n/a" -Evidence "Read:skills index + required_skills union -> no unreferenced skills"
}
else {
  $orphans.skills_unreferenced = $unusedSkills
  Add-Check -Section "E" -Id "E.1" -Name "Skills are referenced" -Status "fail" -Severity "advisory" -Evidence "Read:skills index + required_skills union -> unreferenced skills found" -Details ($unusedSkills -join ", ")
}

$allIntegrationNames = @()
foreach ($intFile in $integrationFiles) {
  $nameLine = Get-Content $intFile.FullName | Where-Object { $_ -match '^integration:\s*' } | Select-Object -First 1
  if ($nameLine) {
    $allIntegrationNames += (($nameLine -split ':',2)[1]).Trim()
  }
}
$allIntegrationNames = $allIntegrationNames | Sort-Object -Unique
$supportIndexRaw = Get-Content (Join-Path $RepoRoot "DOC/knowledge/support-tools/_index.md") -Raw
$featureMapRaw = Get-Content (Join-Path $RepoRoot "DOC/knowledge/feature-maps/feature-integration-map.json") -Raw
$presetRawCombined = ($presetFiles | ForEach-Object { Get-Content $_.FullName -Raw }) -join "`n"
# Build set of names appearing in alternatives: fields across all integration YAMLs
$alternativeNames = @()
foreach ($intFile in $integrationFiles) {
  $inAltBlock = $false
  foreach ($line in (Get-Content $intFile.FullName)) {
    if ($line -match '^alternatives:\s*') { $inAltBlock = $true; continue }
    if ($inAltBlock -and $line -match '^\s*-\s*([a-z0-9\-]+)\s*$') { $alternativeNames += $Matches[1]; continue }
    if ($inAltBlock -and $line -match '^[A-Za-z_]+:\s*') { $inAltBlock = $false }
    # inline array form: alternatives: [a, b, c]
    if ($line -match '^alternatives:\s*\[(.+)\]') {
      ($Matches[1] -split ',') | ForEach-Object { $alternativeNames += $_.Trim().Trim('"').Trim("'") }
    }
  }
}
$alternativeNames = $alternativeNames | Sort-Object -Unique
$unrefIntegrations = @()
foreach ($name in $allIntegrationNames) {
  $inPreset = $presetRawCombined -match ("\b" + [regex]::Escape($name) + "\b")
  $inFeatureMap = $featureMapRaw -match ('"' + [regex]::Escape($name) + '"')
  $inSupportIdx = $supportIndexRaw -match ("\b" + [regex]::Escape($name) + "\b")
  $inAlternatives = $alternativeNames -contains $name
  # Also accept: integration is listed in the integration catalog _index.md
  $inIntegrationIndex = $integrationIndexRaw -match ("\b" + [regex]::Escape($name) + "\b")
  if (-not ($inPreset -or $inFeatureMap -or $inSupportIdx -or $inAlternatives -or $inIntegrationIndex)) {
    $unrefIntegrations += $name
  }
}
if ($unrefIntegrations.Count -eq 0) {
  Add-Check -Section "E" -Id "E.2" -Name "Integrations are referenced" -Status "pass" -Severity "n/a" -Evidence "Read:integration names vs presets+feature-map+support-tools+alternatives+catalog -> all referenced"
}
else {
  $orphans.integrations_unreferenced = $unrefIntegrations
  Add-Check -Section "E" -Id "E.2" -Name "Integrations are referenced" -Status "fail" -Severity "advisory" -Evidence "Read:integration names vs presets+feature-map+support-tools+alternatives+catalog -> unreferenced integrations" -Details ($unrefIntegrations -join ", ")
}

$unreachablePresets = @()
foreach ($preset in $presetFiles) {
  $raw = Get-Content $preset.FullName -Raw
  if (($raw -notmatch '(?m)^\s+archetype:\s*') -or ($raw -notmatch '(?m)^\s+tier_band:\s*')) {
    $unreachablePresets += $preset.Name
  }
}
if ($unreachablePresets.Count -eq 0) {
  Add-Check -Section "E" -Id "E.3" -Name "Presets selectable metadata" -Status "pass" -Severity "n/a" -Evidence "Read:integration-presets applies_to.archetype + applies_to.tier_band -> present"
}
else {
  $orphans.presets_unselectable = $unreachablePresets
  Add-Check -Section "E" -Id "E.3" -Name "Presets selectable metadata" -Status "fail" -Severity "advisory" -Evidence "Read:integration-presets -> missing applies_to metadata" -Details ($unreachablePresets -join ", ")
}

if ($unloadedConstraints.Count -eq 0) {
  Add-Check -Section "E" -Id "E.4" -Name "Constraint files loaded by reviewer" -Status "pass" -Severity "n/a" -Evidence "Read:constraints/*.md vs reviewer loads -> complete"
}
else {
  Add-Check -Section "E" -Id "E.4" -Name "Constraint files loaded by reviewer" -Status "fail" -Severity "blocker" -Evidence "Read:constraints/*.md vs reviewer loads -> missing constraints" -Details ($unloadedConstraints -join ", ")
}

$specUnref = @()
foreach ($spec in $specFiles) {
  $needle = [regex]::Escape($spec.Name)
  $used = $false
  foreach ($agent in $agentFiles) {
    $raw = Get-Content $agent.FullName -Raw
    if ($raw -match $needle) {
      $used = $true
      break
    }
  }
  if (-not $used) {
    $specUnref += $spec.Name
  }
}
if ($specUnref.Count -eq 0) {
  Add-Check -Section "E" -Id "E.5" -Name "Spec-rules are referenced" -Status "pass" -Severity "n/a" -Evidence "Grep:spec-rule file names across agent files -> all referenced"
}
else {
  $orphans.spec_rules_unreferenced = $specUnref
  Add-Check -Section "E" -Id "E.5" -Name "Spec-rules are referenced" -Status "fail" -Severity "advisory" -Evidence "Grep:spec-rule file names across agent files -> unreferenced files found" -Details ($specUnref -join ", ")
}

# SECTION F
$fixtureFiles = Get-ChildItem -Path (Join-Path $RepoRoot "DOC/validation/audit-fixtures") -Filter *.json
$fixtureIssues = @()
$negativeFixtureIssues = @()
foreach ($fixture in $fixtureFiles) {
  $fixtureObj = Get-Content $fixture.FullName -Raw | ConvertFrom-Json
  $expectedPath = Join-Path $RepoRoot ("DOC/validation/audit-fixtures/expected-outputs/" + $fixture.BaseName + ".expected.json")
  if (-not (Test-Path $expectedPath)) {
    $fixtureIssues += "$($fixture.Name)::missing expected output"
    continue
  }

  $expectedObj = Get-Content $expectedPath -Raw | ConvertFrom-Json
  if ($fixtureObj.expected_outcome -eq "block") {
    if (-not $expectedObj.expected_block_response) {
      $negativeFixtureIssues += "$($fixture.Name)::missing expected_block_response"
    }
  }
  else {
    if (-not $expectedObj.expected_artifacts) {
      $fixtureIssues += "$($fixture.Name)::missing expected_artifacts"
    }
  }
}
if ($fixtureIssues.Count -eq 0) {
  Add-Check -Section "F" -Id "F.1" -Name "Fixture-driven plan walk (structural)" -Status "pass" -Severity "n/a" -Evidence "Read:fixtures + expected-outputs -> structural pairs valid"
}
else {
  Add-Check -Section "F" -Id "F.1" -Name "Fixture-driven plan walk (structural)" -Status "fail" -Severity "blocker" -Evidence "Read:fixtures + expected-outputs -> structural gaps" -Details ($fixtureIssues -join "; ")
}

if ($negativeFixtureIssues.Count -eq 0) {
  Add-Check -Section "F" -Id "F.2" -Name "Negative fixtures block metadata" -Status "pass" -Severity "n/a" -Evidence "Read:negative fixtures + expected block responses -> metadata present"
}
else {
  Add-Check -Section "F" -Id "F.2" -Name "Negative fixtures block metadata" -Status "fail" -Severity "blocker" -Evidence "Read:negative fixtures + expected block responses -> missing block metadata" -Details ($negativeFixtureIssues -join "; ")
}

Add-Check -Section "F" -Id "F.3" -Name "Two-run hash match" -Status "not-applicable" -Severity "n/a" -Evidence "Bash:executor unavailable in documentation-only audit run" -Details "reason=executor-not-available"

# F.4 Marketing quality fixture parity (documentation-level parity check)
$marketingFixturePath = Join-Path $RepoRoot "DOC/validation/audit-fixtures/brief-marketing-quality-depth.json"
$marketingExpectedPath = Join-Path $RepoRoot "DOC/validation/audit-fixtures/expected-outputs/brief-marketing-quality-depth.expected.json"

if ((-not (Test-Path $marketingFixturePath)) -or (-not (Test-Path $marketingExpectedPath))) {
  $missing = @()
  if (-not (Test-Path $marketingFixturePath)) { $missing += "missing_fixture" }
  if (-not (Test-Path $marketingExpectedPath)) { $missing += "missing_expected" }
  Add-Check -Section "F" -Id "F.4" -Name "Marketing quality fixture parity" -Status "fail" -Severity "blocker" -Evidence "Read:marketing quality fixture + expected output -> missing" -Details ($missing -join ", ")
}
else {
  $fixtureObj = Get-Content $marketingFixturePath -Raw | ConvertFrom-Json
  $expectedObj = Get-Content $marketingExpectedPath -Raw | ConvertFrom-Json

  $requiredBlocks = @($fixtureObj.expected_quality_contract.validation_schema_required_blocks)
  $expectedBlocks = @($expectedObj.expected_validation_report.required_top_level_blocks)
  $missingBlocks = @($requiredBlocks | Where-Object { $expectedBlocks -notcontains $_ })

  $requiredFrontendConstraints = @($fixtureObj.expected_quality_contract.frontend_constraints_required)
  $minPassed = @($expectedObj.expected_validation_report.constraints_min_passed)
  $missingConstraints = @($requiredFrontendConstraints | Where-Object { $minPassed -notcontains $_ })

  $modeExpected = [string]$fixtureObj.expected_quality_contract.content_library_mode
  $modeActual = if ($expectedObj.expected_frontend_quality) { [string]$expectedObj.expected_frontend_quality.content_library_mode } else { "" }
  $hasSectionDetail = $false
  $routeOnlyParity = $true
  if ($expectedObj.expected_frontend_quality) {
    $hasSectionDetail = [bool]$expectedObj.expected_frontend_quality.page_specs_have_section_detail
    $routeOnlyParity = [bool]$expectedObj.expected_frontend_quality.route_only_parity
  }

  $issues = @()
  if (-not $expectedObj.expected_frontend_quality) { $issues += "missing_expected_frontend_quality" }
  if ($missingBlocks.Count -gt 0) { $issues += ("missing_required_blocks=" + ($missingBlocks -join ",")) }
  if ($missingConstraints.Count -gt 0) { $issues += ("missing_required_constraints=" + ($missingConstraints -join ",")) }
  if ($modeActual -ne $modeExpected) { $issues += "content_library_mode_mismatch(expected=$modeExpected actual=$modeActual)" }
  if ($hasSectionDetail -ne $true) { $issues += "page_specs_have_section_detail_expected_true" }
  if ($routeOnlyParity -ne $false) { $issues += "route_only_parity_expected_false" }

  if ($issues.Count -eq 0) {
    Add-Check -Section "F" -Id "F.4" -Name "Marketing quality fixture parity" -Status "pass" -Severity "n/a" -Evidence "Read:brief-marketing-quality-depth fixture + expected -> required quality signals present"
  }
  else {
    Add-Check -Section "F" -Id "F.4" -Name "Marketing quality fixture parity" -Status "fail" -Severity "blocker" -Evidence "Read:brief-marketing-quality-depth fixture + expected -> quality/parity gaps" -Details ($issues -join "; ")
  }
}

# SECTION G
$constraintFilesFull = Get-ChildItem -Path (Join-Path $RepoRoot "DOC/validation/constraints") -Filter *.md
$noDetection = @()
$idList = @()
foreach ($cf in $constraintFilesFull) {
  $raw = Get-Content $cf.FullName -Raw
  $ids = [regex]::Matches($raw, '\b(?:C|F|SC|PC|DC|TC|AC|I)\d+\b') | ForEach-Object { $_.Value }
  $idList += $ids
  if ($ids.Count -gt 0 -and $raw -notmatch '(?m)^\*\*Detection:\*\*') {
    $noDetection += $cf.Name
  }
}
if ($noDetection.Count -eq 0) {
  Add-Check -Section "G" -Id "G.1" -Name "Detection methods declared" -Status "pass" -Severity "n/a" -Evidence "Read:constraints/*.md -> Detection sections present for constraint docs"
}
else {
  Add-Check -Section "G" -Id "G.1" -Name "Detection methods declared" -Status "fail" -Severity "blocker" -Evidence "Read:constraints/*.md -> missing Detection sections" -Details ($noDetection -join ", ")
}

$idToFiles = @{}
foreach ($cf in $constraintFilesFull) {
  $raw = Get-Content $cf.FullName -Raw
  $ids = [regex]::Matches($raw, '(?m)^##\s+((?:C|F|SC|PC|DC|TC|AC|I)\d+)\b') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  foreach ($id in $ids) {
    if (-not $idToFiles.ContainsKey($id)) {
      $idToFiles[$id] = New-Object System.Collections.Generic.HashSet[string]
    }
    [void]$idToFiles[$id].Add($cf.Name)
  }
}

$dupeIds = @()
foreach ($id in $idToFiles.Keys) {
  if ($idToFiles[$id].Count -gt 1) {
    $dupeIds += "$id (" + (($idToFiles[$id] | Sort-Object) -join ',') + ")"
  }
}
if (@($dupeIds).Count -eq 0) {
  Add-Check -Section "G" -Id "G.2" -Name "Constraint ID uniqueness" -Status "pass" -Severity "n/a" -Evidence "Grep:constraint IDs across files -> unique"
}
else {
  Add-Check -Section "G" -Id "G.2" -Name "Constraint ID uniqueness" -Status "fail" -Severity "blocker" -Evidence "Grep:constraint IDs across files -> duplicates found" -Details (($dupeIds | Sort-Object -Unique) -join ", ")
}

# SECTION H
$chainAgents = @("intake_strategist","integration_planner","frontend_planner","backend_planner","devops_planner","qa_planner","security_auditor","performance_auditor","reviewer")
$missingChainAgents = @()
foreach ($a in $chainAgents) {
  if (-not (Test-Path (Join-Path $RepoRoot "DOC/agents/$a.agent.md"))) {
    $missingChainAgents += $a
  }
}
if ($missingChainAgents.Count -eq 0) {
  Add-Check -Section "H" -Id "H.1" -Name "Per-fixture chain agent presence" -Status "pass" -Severity "n/a" -Evidence "Read:chain agent files -> all stages present"
}
else {
  Add-Check -Section "H" -Id "H.1" -Name "Per-fixture chain agent presence" -Status "fail" -Severity "blocker" -Evidence "Read:chain agent files -> missing stages" -Details ($missingChainAgents -join ", ")
}

if ($negativeFixtureIssues.Count -eq 0) {
  Add-Check -Section "H" -Id "H.2" -Name "Negative fixture block contracts" -Status "pass" -Severity "n/a" -Evidence "Read:negative fixtures and expected outputs -> block contracts present"
}
else {
  Add-Check -Section "H" -Id "H.2" -Name "Negative fixture block contracts" -Status "fail" -Severity "blocker" -Evidence "Read:negative fixtures and expected outputs -> block contract gaps" -Details ($negativeFixtureIssues -join "; ")
}

$artifactProducerIssues = @()
$indexRawForArtifacts = Get-Content $indexPath -Raw
foreach ($fixture in $fixtureFiles) {
  $expectedPath = Join-Path $RepoRoot ("DOC/validation/audit-fixtures/expected-outputs/" + $fixture.BaseName + ".expected.json")
  if (-not (Test-Path $expectedPath)) { continue }
  $expectedObj = Get-Content $expectedPath -Raw | ConvertFrom-Json
  if (-not $expectedObj.expected_artifacts) { continue }
  foreach ($artifact in @($expectedObj.expected_artifacts)) {
    if ($indexRawForArtifacts -notmatch [regex]::Escape($artifact)) {
      $artifactProducerIssues += "$($fixture.Name)::$artifact"
    }
  }
}
if ($artifactProducerIssues.Count -eq 0) {
  Add-Check -Section "H" -Id "H.3" -Name "Expected artifacts have producers" -Status "pass" -Severity "n/a" -Evidence "Read:expected output artifacts vs DOC/agents/_index.md map -> all covered"
}
else {
  Add-Check -Section "H" -Id "H.3" -Name "Expected artifacts have producers" -Status "fail" -Severity "blocker" -Evidence "Read:expected output artifacts vs DOC/agents/_index.md map -> missing producers" -Details ($artifactProducerIssues -join "; ")
}

# H.4 Delivery classification consistency
$orch = Join-Path $RepoRoot "DOC/agents/execution_orchestrator.agent.md"
$qg = Join-Path $RepoRoot "DOC/core/quality-gates.md"
$acc = Join-Path $RepoRoot "DOC/validation/checklists/execution-acceptance-checklist.md"

$policyIssues = @()
$recordMissingPattern = {
  param(
    [string]$FilePath,
    [string]$Label,
    [string]$Pattern
  )

  if (-not (Select-String -Path $FilePath -Pattern $Pattern -SimpleMatch -Quiet)) {
    $script:policyIssues += "$Label missing pattern: $Pattern"
  }
}

if ((-not (Test-Path $orch)) -or (-not (Test-Path $qg)) -or (-not (Test-Path $acc))) {
  $missing = @()
  if (-not (Test-Path $orch)) { $missing += "missing_execution_orchestrator" }
  if (-not (Test-Path $qg)) { $missing += "missing_quality_gates" }
  if (-not (Test-Path $acc)) { $missing += "missing_execution_acceptance_checklist" }
  Add-Check -Section "H" -Id "H.4" -Name "Delivery classification consistency" -Status "fail" -Severity "blocker" -Evidence "Read:delivery classification sources -> missing" -Details ($missing -join ", ")
}
else {
  $enumTokens = @("production_candidate","baseline_prototype","blocked")

  & $recordMissingPattern -FilePath $orch -Label "execution_orchestrator" -Pattern "delivery_class"
  foreach ($t in $enumTokens) { & $recordMissingPattern -FilePath $orch -Label "execution_orchestrator" -Pattern $t }
  & $recordMissingPattern -FilePath $orch -Label "execution_orchestrator" -Pattern "delivery_class=blocked"
  & $recordMissingPattern -FilePath $orch -Label "execution_orchestrator" -Pattern "status=failed"

  & $recordMissingPattern -FilePath $qg -Label "quality-gates" -Pattern "delivery_class"
  foreach ($t in $enumTokens) { & $recordMissingPattern -FilePath $qg -Label "quality-gates" -Pattern $t }
  & $recordMissingPattern -FilePath $qg -Label "quality-gates" -Pattern "delivery_class=blocked"
  & $recordMissingPattern -FilePath $qg -Label "quality-gates" -Pattern "status=failed"

  & $recordMissingPattern -FilePath $acc -Label "execution-acceptance-checklist" -Pattern "delivery_class"
  foreach ($t in $enumTokens) { & $recordMissingPattern -FilePath $acc -Label "execution-acceptance-checklist" -Pattern $t }
  & $recordMissingPattern -FilePath $acc -Label "execution-acceptance-checklist" -Pattern 'delivery_class is `blocked`'
  & $recordMissingPattern -FilePath $acc -Label "execution-acceptance-checklist" -Pattern 'status must be `failed`'

  if ($policyIssues.Count -eq 0) {
    $orchLoc = Find-FirstMatchLocation -FilePath $orch -Pattern "delivery_class"
    $qgLoc = Find-FirstMatchLocation -FilePath $qg -Pattern "delivery_class"
    $accLoc = Find-FirstMatchLocation -FilePath $acc -Pattern "DELIVERY CLASS RULE"
    Add-Check -Section "H" -Id "H.4" -Name "Delivery classification consistency" -Status "pass" -Severity "n/a" -Evidence "Grep:delivery_class policy -> $orchLoc; $qgLoc; $accLoc"
  }
  else {
    Add-Check -Section "H" -Id "H.4" -Name "Delivery classification consistency" -Status "fail" -Severity "blocker" -Evidence "Grep:delivery_class policy -> missing/contradictory" -Details ($policyIssues -join "; ")
  }
}

# A.5 Audit template coverage (prevent false READY when template grows)
$templatePath = Join-Path $RepoRoot "DOC/validation/audit-template.md"
if (-not (Test-Path $templatePath)) {
  Add-Check -Section "A" -Id "A.5" -Name "Audit template coverage" -Status "fail" -Severity "blocker" -Evidence "Read:DOC/validation/audit-template.md -> missing" -Details "missing_audit_template"
}
else {
  $templateRaw = Get-Content $templatePath -Raw
  $templateIds = [regex]::Matches($templateRaw, '(?m)^###\s+([A-H]\.\d+)\b') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
  $runnerIds = @()
  foreach ($s in $sectionOrder) {
    foreach ($c in $sections[$s].checks) {
      $runnerIds += $c.id
    }
  }
  $runnerIds = $runnerIds | Sort-Object -Unique

  $missing = @($templateIds | Where-Object { $_ -ne "A.5" -and ($runnerIds -notcontains $_) })
  if ($missing.Count -eq 0) {
    Add-Check -Section "A" -Id "A.5" -Name "Audit template coverage" -Status "pass" -Severity "n/a" -Evidence "Read:audit-template check IDs -> template=$($templateIds.Count), runner=$($runnerIds.Count), missing=0"
  }
  else {
    Add-Check -Section "A" -Id "A.5" -Name "Audit template coverage" -Status "fail" -Severity "blocker" -Evidence "Read:audit-template check IDs -> missing runner implementations" -Details ("missing=" + ($missing -join ", "))
  }
}

$sectionsPassed = ($sectionOrder | Where-Object { $sections[$_].status -eq "passed" }).Count
$productionReadyPct = [int](($checkStats.pass / [math]::Max(1, $checkStats.total)) * 100)
$verdict = if ($blockerCount -gt 0) { "NOT_READY" } elseif ($advisoryCount -gt 0 -or $driftCount -gt 0) { "READY_WITH_ADVISORIES" } else { "READY" }
$verdictReason = if ($verdict -eq "NOT_READY") {
  "Blocker checks failed. Resolve blockers and rerun full audit."
} elseif ($verdict -eq "READY_WITH_ADVISORIES") {
  "No blockers remain, but advisories or drift are present."
} else {
  "All checks passed with no blockers or advisories."
}

$summary = [ordered]@{
  production_ready_pct = $productionReadyPct
  verdict = $verdict
  verdict_one_liner = $verdictReason
  blocker_count = $blockerCount
  advisory_count = $advisoryCount
  drift_count = $driftCount
  sections_passed = "$sectionsPassed / 8"
  total_checks_run = $checkStats.total
  checks_passed = $checkStats.pass
  checks_failed = $checkStats.fail
  checks_not_applicable = $checkStats.na
}

$fixes = @()
if ($blockerCount -gt 0) {
  $fixes += [ordered]@{
    rank = 1
    target_file = "DOC/validation/checklists/full-audit-runner.ps1"
    change_type = "edit"
    exact_change = "Address failing checks called out in report details and ensure blocker checks pass."
    blast_radius = "validation pipeline"
    closes_check_ids = @("BLOCKER_SET")
    risk = "medium"
  }
}

$reportObj = [ordered]@{
  audit_run = $auditRun
  summary = $summary
  sections = $sections
  orphans = $orphans
  broken_references = $brokenRefs
  inconsistencies = $inconsistencies
  fixes = $fixes
  determinism = [ordered]@{
    fixture = $null
    run_1_hash = $null
    run_2_hash = $null
    match = $null
    drifting_fields = @()
  }
  smoke = [ordered]@{
    fixture = "all-fixtures"
    expected_outcome = "pass-or-block-by-fixture-contract"
    actual_outcome = if ($sections["H"].status -eq "passed") { "pass" } else { "drift" }
    chain_walk = @()
    contract_mismatches = @()
    artifact_producers = @()
  }
  verdict = [ordered]@{
    state = $verdict
    reason = $verdictReason
    next_action = if ($verdict -eq "NOT_READY") { "Fix blocker checks and rerun this script." } elseif ($verdict -eq "READY_WITH_ADVISORIES") { "Address advisories, then rerun for a fully clean gate." } else { "System is certifiably ready under current audit contract." }
  }
}

$jsonPath = Join-Path $reportsDir ("audit-report.$timestamp.json")
$mdPath = Join-Path $reportsDir ("audit-report.$timestamp.md")

$reportObj | ConvertTo-Json -Depth 12 | Set-Content -Path $jsonPath -Encoding UTF8

$md = @()
$md += "# Audit Report"
$md += ""
$md += "## Run Header"
$md += "- timestamp: $($auditRun.timestamp)"
$md += "- target_dir: $($auditRun.target_dir)"
$md += "- mode: $($auditRun.mode)"
$md += ""
$md += "## Executive Summary"
$md += "- verdict: $verdict"
$md += "- production_ready_pct: $productionReadyPct"
$md += "- blocker_count: $blockerCount"
$md += "- advisory_count: $advisoryCount"
$md += "- drift_count: $driftCount"
$md += "- sections_passed: $sectionsPassed / 8"
$md += ""
$md += "## Section Results"
foreach ($s in $sectionOrder) {
  $section = $sections[$s]
  $md += "### $s. $($section.name)"
  $md += "- status: $($section.status)"
  $md += "- blockers: $($section.blockers)"
  $md += "- advisories: $($section.advisories)"
  foreach ($c in $section.checks) {
    $md += "- [$($c.status)] $($c.id) ($($c.severity)): $($c.name)"
    $md += "  evidence: $($c.evidence)"
    if (-not [string]::IsNullOrWhiteSpace($c.details)) {
      $md += "  details: $($c.details)"
    }
  }
  $md += ""
}
$md += "## Verdict"
$md += "- state: $verdict"
$md += "- reason: $verdictReason"
$md += ""
$md += "## Report Files"
$md += "- json: $jsonPath"
$md += "- markdown: $mdPath"

$md -join "`n" | Set-Content -Path $mdPath -Encoding UTF8

Write-Host "Audit complete."
Write-Host "Verdict: $verdict"
Write-Host "JSON report: $jsonPath"
Write-Host "Markdown report: $mdPath"

if ($CiMode -and $blockerCount -gt 0) {
  Write-Error "BLOCKER checks failed ($blockerCount). Failing CI gate."
  exit 1
}

exit 0
