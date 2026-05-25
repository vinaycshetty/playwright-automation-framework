# TC-NH-250271-08 — Import in Test Mode (resulting status = Test Entered)

- Objective: Verify import can run in Test mode and resulting payments are created with status = Test Entered and do not proceed to production actions.
- Preconditions:
  - Import map supports Test mode.
  - Template is Approved.
- Test Data: Valid file with one or more records.
- Steps:
  1. Select Test Mode when running "Wires from Template" import.
  2. Upload file and complete import.
- Expected Result:
  - Payments created with status = Test Entered.
  - No downstream processing (no funds movement/approvals) triggered.
- Test Type: Positive, Manual/Automated

---
