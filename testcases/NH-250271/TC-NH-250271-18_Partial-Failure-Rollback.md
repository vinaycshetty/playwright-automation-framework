# TC-NH-250271-18 — Edge: Partial failure and transactional behavior / rollback semantics

- Objective: Confirm how the system handles partial failures: row-level failures vs. transactional rollback across entire file.
- Preconditions:
  - System supports either row-level error handling or full-file atomic behavior (specify expected in test plan).
- Test Data: File where one row contains invalid data while others are valid.
- Steps:
  1. Upload file and inspect outcome.
- Expected Result:
  - System behaves per design: either imports valid rows and reports invalid ones, or rolls back entire file and reports failure.
  - No data left in inconsistent state.
- Test Type: Edge/Regression, Manual/Automated

---
