# TC-NH-250271-15 — Performance: Large file import / throughput and resiliency

- Objective: Validate performance, memory, and resiliency when importing a large file (e.g., 10k–100k records) and that processing completes without data loss.
- Preconditions:
  - Load test environment or dev environment capable of large imports.
- Test Data: Large generated file containing valid template-sourced records.
- Steps:
  1. Start import and monitor system resource usage, import time, and error rates.
  2. Confirm all records imported successfully or failures reported with reasons.
- Expected Result:
  - System processes file within acceptable SLA (define via performance requirements).
  - No partial data corruption; errors are reported.
- Test Type: Performance/Load, Automated

---
