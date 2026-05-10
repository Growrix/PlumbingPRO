# SPEC TEMPLATE: SECURITY REPORT

## PURPOSE
Use this template to produce a security assessment report during planning review, after a penetration test, or as part of a post-incident report. The reviewer agent emits this after running security constraints SC1–SC12.

---

## SECURITY REPORT

**Report ID:** SR-[NNN]
**Type:** PLANNING_REVIEW | POST_INCIDENT | PENETRATION_TEST | COMPLIANCE_AUDIT
**Date:** [YYYY-MM-DD]
**Plan ID:** [plan_id] (if planning review)
**Severity Distribution:** P1:[N] P2:[N] P3:[N] P4:[N]
**Overall Status:** PASSED | FAILED | CONDITIONAL_PASS

---

## EXECUTIVE SUMMARY

```
[2-4 sentences: what was reviewed, what was found, overall risk posture, 
and the key action required before proceeding.]
```

---

## SCOPE
```
components_reviewed:
  - [e.g., All API route handlers]
  - [e.g., Authentication and authorization layer]
  - [e.g., Webhook handlers]
  - [e.g., Database schema and access patterns]
  - [e.g., Environment variable configuration]
  - [e.g., Third-party integrations]
out_of_scope:
  - [e.g., Penetration testing of external providers (Clerk, Stripe)]
  - [e.g., Physical security]
```

---

## FINDINGS

### CRITICAL (Must fix before deploy)

#### [FIND-001]: [Short Finding Title]
```
severity: CRITICAL
constraint: SC[N] | C[N]
location: [file/service/route]
description: [What the vulnerability is and why it's dangerous]
evidence: [Specific code pattern, log, or artifact showing the issue]
remediation: [Exact steps to fix]
verification: [How to confirm the fix worked]
```

---

### HIGH (Must fix in this sprint)

#### [FIND-002]: [Short Finding Title]
```
severity: HIGH
constraint: SC[N] | C[N]
location: [file/service/route]
description: [...]
remediation: [...]
```

---

### MEDIUM (Fix within 30 days)

#### [FIND-003]: [Short Finding Title]
```
severity: MEDIUM
constraint: SC[N]
location: [...]
description: [...]
remediation: [...]
```

---

### LOW (Fix within 90 days or accept risk)

#### [FIND-004]: [Short Finding Title]
```
severity: LOW
constraint: SC[N]
description: [...]
remediation: [...]
risk_acceptance: [authorized by] | pending
```

---

## CONSTRAINT EVALUATION SUMMARY

| Constraint | Status | Finding |
|------------|--------|---------|
| SC1 — No plaintext secrets | PASSED | — |
| SC2 — Auth token not in logs | PASSED | — |
| SC3 — Webhook signature required | FAILED | FIND-001 |
| SC4 — Rate limit on LLM routes | PASSED | — |
| SC5 — Server SDKs not in client | PASSED | — |
| SC6 — File upload MIME validation | FAILED | FIND-002 |
| SC7 — Tenant scope in queries | PASSED | — |
| SC8 — CSP header declared | PASSED | — |
| SC9 — CORS allowlist explicit | PASSED | — |
| SC10 — Audit log for sensitive ops | WARNING | FIND-003 |
| SC11 — Input size limits | PASSED | — |
| SC12 — Dependency audit in CI | PASSED | — |

---

## OWASP TOP 10 COVERAGE

| OWASP Risk | Mitigated By | Status |
|------------|-------------|--------|
| A01 Broken Access Control | S3, S4, SC7 | COVERED |
| A02 Cryptographic Failures | S1, SC1 | COVERED |
| A03 Injection | S2, S8 | COVERED |
| A04 Insecure Design | S3, S4, S7 | COVERED |
| A05 Security Misconfiguration | SC8, SC9 | COVERED |
| A06 Vulnerable Components | SC12 | COVERED |
| A07 Auth & Session Mgmt | S3, SC2 | COVERED |
| A08 Software Integrity | SC1, SC3 | COVERED |
| A09 Logging & Monitoring | S6, SC10 | PARTIAL |
| A10 SSRF | S2 | COVERED |

---

## REMEDIATION PLAN

| Finding | Owner | Due Date | Status |
|---------|-------|----------|--------|
| FIND-001 | [engineer] | [date] | OPEN |
| FIND-002 | [engineer] | [date] | OPEN |
| [find] | | | |

---

## SIGN-OFF

| Role | Name | Decision | Date |
|------|------|----------|------|
| Reviewer Agent | reviewer.agent v1 | [APPROVED|BLOCKED] | [date] |
| Security Lead | [human] | [APPROVED|PENDING] | [date] |

**Final Decision:** APPROVED TO PROCEED | BLOCKED — resolve findings before proceeding.
