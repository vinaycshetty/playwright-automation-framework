# TC-NH-250271-20 — E2E: Happy path end-to-end import and verification

- Objective: Full end-to-end validation from import file upload through payment creation, routing, audit, and list-view actions.
- Preconditions:
  - All dependencies configured (import map, templates, entitlements, test systems for subsequent routing).
- Test Data: Representative file with mixed valid records.
- Steps:
  1. Upload file with "Wires from Template" map.
  2. Confirm import completes and payments created.
  3. Verify payments follow expected routing/approval workflows (if applicable) and show correct statuses.
  4. Validate audit entries and confirm payments are actionable post-import.
- Expected Result:
  - End-to-end flow completes successfully with expected statuses and audit entries.
- Test Type: E2E, Automated/Manual

---
