# TC-NH-250271-12 — Negative: Invalid amounts / fields / data types

- Objective: Verify validation when numeric/format fields are invalid (e.g., negative amount, invalid account number, invalid date format).
- Preconditions:
  - Import format validates field types.
- Test Data: Files with
  - Negative amounts, zero amounts if invalid, very large amounts
  - Invalid account numbers, invalid date formats
- Steps:
  1. Upload each file and check import results.
- Expected Result:
  - Row-level validation errors returned.
  - Invalid rows not imported; valid rows (if any) are processed.
- Test Type: Negative, Manual/Automated

---
