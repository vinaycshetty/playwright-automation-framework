# TC-NH-250271-14 — Negative: Template belongs to different client / scope

- Objective: Verify import rejects templates that belong to another client or are out of scope for current import context.
- Preconditions:
  - Template exists but is scoped to different client/bank.
- Test Data: File referencing cross-client Template Code.
- Steps:
  1. Upload file under client A context referencing a template owned by client B.
- Expected Result:
  - Record rejected with a meaningful error about template ownership/scope.
- Test Type: Negative, Manual/Automated

---
