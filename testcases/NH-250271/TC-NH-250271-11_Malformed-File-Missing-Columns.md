# TC-NH-250271-11 — Negative: Malformed file (missing required columns / wrong delimiter)

- Objective: Verify system validation and error reporting for malformed input files.
- Preconditions:
  - Import map expects specific columns and delimiter.
- Test Data: Files with:
  - Wrong delimiter (e.g., pipe instead of comma)
  - Missing required fields (e.g., beneficiary account, amount)
- Steps:
  1. Upload each malformed file using "Wires from Template" map.
  2. Observe import validation and error output.
- Expected Result:
  - Clear, row-level or file-level validation errors explaining the issue.
  - No creation of payments for invalid rows.
- Test Type: Negative, Manual/Automated

---
