# TC-NH-250271-03 — Import: Mixed payment types (Wire Dom / Intl / Drawdown)

- Objective: Verify import of mixed payment types in one file (Wire Domestic, Wire International, Drawdown) using template codes mapped to each type.
- Preconditions:
  - Templates for each payment type exist and are Approved.
  - User entitled to at least one of the target payment types (test variations below).
- Test Data: File with 3 records (one per payment type) including corresponding Template Codes.
- Steps:
  1. Upload file using "Wires from Template" map.
  2. Inspect each created payment’s type and entry method.
- Expected Result:
  - Each record creates a payment matching the template’s payment type.
  - Payments show Entry Method = Created from Template.
- Test Type: Positive, Manual/Automated

---
