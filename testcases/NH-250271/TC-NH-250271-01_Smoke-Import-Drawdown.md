# TC-NH-250271-01 — Smoke: Import single Drawdown record

- Objective: Verify that a single Drawdown record can be imported using the "Wires from Template" import map and results in a Created-from-Template payment.
- Preconditions:
  - Import map of type "Wires from Template" exists and visible to the test user.
  - Template Code referenced in file exists and is in Approved status and linked to Drawdown payment type.
  - Test user has permissions: Import and Create Payment from Template for Drawdown.
- Test Data: CSV/TSV import file with one record containing Template Code, required fields for Drawdown.
- Steps:
  1. Login as test user.
  2. Navigate to Import > select "Wires from Template" map.
  3. Upload the sample file and start import.
  4. Wait for import to complete and open the resulting payment record.
- Expected Result:
  - Import completes successfully.
  - A payment is created with Entry Method = "Created from Template" and payment type = Drawdown.
  - Audit shows a create action (no modification).
- Test Type: Positive, Manual/Automated

---
