# TC-NH-250271-02 — Import: Multiple Drawdown records

- Objective: Verify importing a file containing multiple Drawdown records creates corresponding payments.
- Preconditions:
  - Same as TC-01.
- Test Data: Import file with 5 Drawdown records (unique Template Codes or same template repeated if allowed).
- Steps:
  1. Use "Wires from Template" map and upload file.
  2. Monitor import progress and inspect created payments.
- Expected Result:
  - All records imported; each becomes a payment with Entry Method = Created from Template.
  - No partial/inconsistent states after import.
- Test Type: Positive, Manual/Automated

---
