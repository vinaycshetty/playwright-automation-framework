# TC-NH-250271-10 — Payment not available for actions until import completes

- Objective: Verify payments created during import are not available for list-view actions until import finalised.
- Preconditions:
  - Import job is in-progress.
- Test Data: File with multiple records to make import take measurable time.
- Steps:
  1. Start import and during processing, attempt to access/act on the payment(s) from list view.
  2. After import completes, verify actions become available.
- Expected Result:
  - During import the payment(s) should not be actionable or visible for actions.
  - After completion, payments appear and actions are available.
- Test Type: Positive/Edge, Manual/Automated

---
