# SPEC TEMPLATE: RUNBOOK

## PURPOSE
Use this template to produce a runbook for every operational procedure. Runbooks MUST exist before alerts are created (per DevOps Rule DO8). Each runbook covers one specific scenario.

---

## RUNBOOK: [SCENARIO_NAME]

**Runbook ID:** RB-[NNN]
**Severity:** P1 | P2 | P3 | P4
**Service:** [service or feature name]
**Alert Name:** [name of the alert that triggers this runbook, or "manual"]
**Last Updated:** [YYYY-MM-DD]
**Owner:** [team or on-call rotation]

---

### SYMPTOMS
*What does this look like when it's happening?*

- [ ] [Observable symptom 1 — e.g., "Error rate > 5% on /api/chat"]
- [ ] [Observable symptom 2 — e.g., "Sentry alert: UnhandledError spike"]
- [ ] [Observable symptom 3 — e.g., "/api/health returns 503"]

---

### IMPACT
```
affected_users: [all | authenticated users | admins | none]
affected_features: [list affected features]
data_loss_risk: yes | no
revenue_impact: yes | no
estimated_mttr: [N minutes]
```

---

### IMMEDIATE ACTIONS (< 5 minutes)

1. **Acknowledge the alert** in [PagerDuty | Slack | other].
2. **Check health endpoint**: `curl https://[domain]/api/health`
3. **Check Sentry**: open [Sentry project URL] → filter by release → review new errors.
4. **Check Axiom logs**: query `dataset:[AXIOM_DATASET] | filter route = "[affected route]" | sort by @timestamp desc`.
5. **Check Vercel dashboard**: confirm deployment status, any failed builds or function errors.

---

### DIAGNOSIS

#### Step 1: [Diagnosis Step Name]
```
What to check: [specific log query, metric, or command]
What to look for: [what a healthy vs unhealthy state looks like]
```

#### Step 2: [Diagnosis Step Name]
```
What to check: [specific check]
Expected: [expected value]
Action if unexpected: [what to do]
```

---

### REMEDIATION

#### Option A: [Rollback]
```bash
# Revert to previous Vercel deployment
# 1. Open Vercel dashboard → project → deployments
# 2. Find the last known-good deployment SHA
# 3. Click "Redeploy" on that deployment
# OR via CLI:
vercel rollback [deployment-url]
```

#### Option B: [Fix and Redeploy]
```
1. Identify root cause from diagnosis steps.
2. Apply fix in a new branch.
3. Merge to main — CI + Vercel deploy automatically.
4. Verify smoke tests pass on new deployment.
```

#### Option C: [Feature Flag Disable]
```
1. Open PostHog → Feature Flags.
2. Disable "[flag-name]" flag.
3. Confirm affected route stops using the feature.
4. Investigate root cause before re-enabling.
```

---

### VERIFICATION

After remediation, confirm:
- [ ] `GET /api/health` → 200 `{ status: "ok" }`.
- [ ] Error rate in Sentry returns to baseline (< 0.1%).
- [ ] Axiom logs show no further error spikes.
- [ ] Affected users can complete the affected flow.

---

### POST-INCIDENT ACTIONS

- [ ] Write incident report (template: `execution/spec-templates/security-report-spec.template.md`).
- [ ] Create Jira/Linear ticket for root cause fix (if not already resolved).
- [ ] Update this runbook if the steps were insufficient.
- [ ] Review alert thresholds if the alert fired inappropriately.
- [ ] Share blameless post-mortem with team within 48 hours for P1/P2.

---

### ESCALATION PATH

| Level | Contact | When |
|-------|---------|------|
| L1 | On-call engineer | First 15 minutes |
| L2 | [Lead engineer / team lead] | After 15 minutes unresolved |
| L3 | [CTO / stakeholder] | P1 with revenue impact > 30 minutes |
