# TC-NH-250271-04 — Negative: Template Code missing from file

- Objective: Verify system behavior when import file is missing the Template Code column for a template-sourced map.
- Preconditions:
  - Import map is of type "Wires from Template" and requires Template Code.
- Test Data: File without Template Code column.
- Steps:
  1. Upload malformed file with missing Template Code.
  2. Start import and observe error handling.
- Expected Result:
  - Import fails with a clear validation error indicating Template Code missing.
  - No payments created.
  - Error is logged and surfaced to user.
- Test Type: Negative, Manual/Automated

---
