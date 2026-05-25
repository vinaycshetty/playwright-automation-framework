# TC-NH-250271-06 — Negative: User not entitled to Import or Create-from-Template permissions

- Objective: Verify import map visibility and import behavior for users lacking required entitlements.
- Preconditions:
  - Create two users: (A) has Import and Create-from-Template permissions, (B) lacks one or both.
- Test Data: Valid file referencing Approved template.
- Steps:
  1. Login as user B (not entitled).
  2. Navigate to Import page and confirm visibility of "Wires from Template" map.
  3. Attempt to upload file and start import if visible.
- Expected Result:
  - If user lacks permissions, the import map should not be visible. If visible due to UI bug, upload should be blocked and show proper permission error.
  - No payments created and appropriate error/permission message shown.
- Test Type: Negative, Manual/Automated

---
