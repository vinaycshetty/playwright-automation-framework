# TC-NH-250271-07 — Negative: Restricted template access enforced

- Objective: Verify records referencing restricted templates are rejected unless user has explicit access.
- Preconditions:
  - A template exists that is marked restricted to certain user groups/roles and is Approved.
  - Test users: (A) has explicit access, (B) does not.
- Test Data: File with a record referencing the restricted Template Code.
- Steps:
  1. Login as user B (no access) and attempt import.
  2. Login as user A (with access) and attempt same import.
- Expected Result:
  - User B: import should fail for that row with a clear error about template access.
  - User A: import succeeds and creates payment.
- Test Type: Negative/Positive, Manual/Automated

---
