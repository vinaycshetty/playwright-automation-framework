# TC-NH-250271-09 — Audit: Created vs Modified

- Objective: Ensure import-created payments produce a "create" audit event (no "modification").
- Preconditions:
  - Import a valid record using template code.
- Test Data: Single record file.
- Steps:
  1. Run import and capture audit entries for the created payment.
  2. Inspect audit log for action type and details.
- Expected Result:
  - Audit shows a create action for the created payment and not a modification.
  - Audit includes user/actor and timestamp.
- Test Type: Positive, Manual/Automated

---
