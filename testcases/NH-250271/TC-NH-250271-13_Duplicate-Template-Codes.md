# TC-NH-250271-13 — Edge: Duplicate Template Codes in same file

- Objective: Verify behavior when the import file contains duplicate Template Codes (same template referenced multiple times) and duplicate rows.
- Preconditions:
  - Template is Approved and valid.
- Test Data: File with duplicate rows and/or duplicate template codes for different payments.
- Steps:
  1. Upload file and run import.
- Expected Result:
  - System should either accept duplicates as separate payments (if allowed) or reject duplicates with a clear message based on product rules.
  - No data corruption.
- Test Type: Edge, Manual/Automated

---
