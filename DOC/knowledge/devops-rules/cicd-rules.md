# CI/CD RULES
This file complements devops-rules.md.
- CI must run: lint, typecheck, test, build.
- Migrations run before deploy promotion.
- Deploy is blocked on failed validation gates.
- Lint must run with zero warnings (`--max-warnings 0`).
- Promotion to production must be automatic only after all required gates pass.
- Pipelines must publish machine-readable gate evidence (pass/fail per stage).
- Rollback workflow must be automated and callable from pipeline context.
