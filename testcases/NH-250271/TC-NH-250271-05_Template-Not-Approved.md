# TC-NH-250271-05 — Negative: Template exists but is NOT Approved

- Objective: Verify import rejects/handles records that reference templates not in Approved status.
- Preconditions:
  - Template Code in file points to a template in Draft/Archived/Rejected status (not Approved).
- Test Data: File with one record referencing unapproved template.
- Steps:
  1. Upload file and run import using "Wires from Template" map.
  2. Observe import results for the record.
- Expected Result:
  - System rejects the record and reports a validation error specifying template status.
  - No payment is created for that record.
  - Depending on system design: either file-level fail or row-level fail with partial results and clear messaging.
- Test Type: Negative, Manual/Automated

---
