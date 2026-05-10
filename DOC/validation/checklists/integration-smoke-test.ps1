Set-Location "f:\PROJECTS\Agent"

function GetName($path) {
  $line = Get-Content $path -TotalCount 8 | Where-Object { $_ -match 'integration\s*:' } | Select-Object -First 1
  if ($line) { return (($line -split ':', 2)[1]).Trim() }
  return $null
}

$all = Get-ChildItem 'DOC/knowledge/integration-rules' -Recurse -Filter *.yaml | ForEach-Object { GetName $_.FullName } | Where-Object { $_ } | Sort-Object -Unique
$tools = Get-ChildItem 'DOC/knowledge/support-tools' -Recurse -Filter *.yaml | ForEach-Object { GetName $_.FullName } | Where-Object { $_ } | Sort-Object -Unique

Write-Output 'Test_Agent_Loads'
$repo = 'f:\PROJECTS\Agent'
$issues = @()
Get-ChildItem 'DOC/agents/*.agent.md' | ForEach-Object {
  $text = Get-Content $_.FullName -Raw
  $m = [regex]::Match($text, '(?s)^---\s*(.*?)\s*---')
  if (-not $m.Success) { return }
  foreach ($line in ($m.Groups[1].Value -split "`n")) {
    if ($line -match '^\s*-\s*(DOC/[^\s#]+)') {
      $l = $Matches[1].Trim()
      $full = Join-Path $repo $l
      if ($l -match '[\*\?]') {
        $globMatches = @()
        $patternFs = $l -replace '/', '\\'
        if ($patternFs -match '\*\*') {
          $idx = $patternFs.IndexOf('**')
          $root = $patternFs.Substring(0, $idx).TrimEnd('\\')
          $tail = $patternFs.Substring($idx + 2).TrimStart('\\')
          if ([string]::IsNullOrWhiteSpace($tail)) { $tail = '*' }

          if ($tail -match '[\*\?]') {
            $globMatches = Get-ChildItem -Path $root -Recurse -Filter $tail -ErrorAction SilentlyContinue
          }
          else {
            $globMatches = Get-ChildItem -Path (Join-Path $root $tail) -ErrorAction SilentlyContinue
          }
        }
        else {
          $globMatches = Get-ChildItem -Path (Join-Path $repo $patternFs) -ErrorAction SilentlyContinue
        }
        if (-not $globMatches) { $issues += "NO_MATCH::$($_.Name)::$l" }
      }
      else {
        if (-not (Test-Path $full)) { $issues += "MISSING::$($_.Name)::$l" }
      }
    }
  }
}
if ($issues.Count -eq 0) { 'PASS' } else { 'FAIL'; $issues }

Write-Output 'Test_I3_Taxonomy'
$taxonomy = (Get-Content 'DOC/knowledge/automation-rules/outbound-event-taxonomy.md' | Select-String -Pattern '^\| `([^`]+)` \|' -AllMatches).Matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
$eissues = @()
Get-ChildItem 'DOC/knowledge/integration-rules' -Recurse -Filter *.yaml | ForEach-Object {
  $file = $_.FullName
  $lines = Get-Content $file
  $in = $false
  foreach ($line in $lines) {
    if ($line -match '^emits_outbound_events:\s*$') { $in = $true; continue }
    if ($in) {
      if ($line -match '^\s*-\s*([a-z0-9\._-]+)\s*$') {
        $evt = $Matches[1]
        if ($taxonomy -notcontains $evt) { $eissues += "$(Split-Path $file -Leaf)::$evt" }
      }
      elseif ($line -match '^[A-Za-z_]+:\s*') { $in = $false }
    }
  }
}
if ($eissues.Count -eq 0) { 'PASS' } else { 'FAIL'; $eissues | Sort-Object -Unique }

Write-Output 'Test_Preset_Refs'
$pissues = @()
Get-ChildItem 'DOC/knowledge/integration-presets/*.yaml' | ForEach-Object {
  $f = $_.FullName
  $lines = Get-Content $f
  $s = ''
  foreach ($line in $lines) {
    if ($line -match '^integrations:\s*$') { $s = 'i'; continue }
    if ($line -match '^optional:\s*$') { $s = 'o'; continue }
    if ($line -match '^support_tools:\s*$') { $s = 't'; continue }
    if ($line -match '^[A-Za-z_]+:\s*$') { $s = ''; continue }
    if ($s -eq 'i' -and $line -match '^\s+[a-z_]+:\s*([a-z0-9\-]+)') {
      $n = $Matches[1]
      if ($all -notcontains $n) { $pissues += "$(Split-Path $f -Leaf)::integrations::$n" }
    }
    if ($s -eq 'o' -and $line -match '^\s*-\s*[a-z0-9\-]+\s*:\s*([a-z0-9\-]+)') {
      $n = $Matches[1]
      if ($all -notcontains $n) { $pissues += "$(Split-Path $f -Leaf)::optional::$n" }
    }
    if ($s -eq 't' -and $line -match '^\s*-\s*([a-z0-9\-]+)') {
      $n = $Matches[1]
      if ($tools -notcontains $n) { $pissues += "$(Split-Path $f -Leaf)::support_tools::$n" }
    }
  }
}
if ($pissues.Count -eq 0) { 'PASS' } else { 'FAIL'; $pissues | Sort-Object -Unique }

Write-Output 'Test_Required_Skills'
$skillFiles = Get-ChildItem 'DOC/knowledge/skills/*.md' | ForEach-Object { $_.BaseName }
$sissues = @()
Get-ChildItem 'DOC/knowledge/integration-rules' -Recurse -Filter *.yaml | ForEach-Object {
  $file = $_.FullName
  $lines = Get-Content $file
  $in = $false
  foreach ($line in $lines) {
    if ($line -match '^required_skills:\s*$') { $in = $true; continue }
    if ($in) {
      if ($line -match '^\s*-\s*([^#\s]+)') {
        $sname = $Matches[1].Trim()
        if ($skillFiles -notcontains $sname) { $sissues += "$(Split-Path $file -Leaf)::$sname" }
      }
      elseif ($line -match '^[A-Za-z_]+:\s*') { $in = $false }
    }
  }
}
if ($sissues.Count -eq 0) { 'PASS' } else { 'FAIL'; $sissues | Sort-Object -Unique }

Write-Output 'Test_Guards'
$ip = Get-Content 'DOC/agents/integration_planner.agent.md' -Raw
'has_STUB_AS_PRIMARY=' + ($ip -match 'STUB_AS_PRIMARY')
'has_TIER_BAND_MISMATCH=' + ($ip -match 'TIER_BAND_MISMATCH')
