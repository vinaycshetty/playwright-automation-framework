# TC-NH-250271-19 — UI: Import map visibility based on entitlement

- Objective: Verify the "Wires from Template" import map is visible only to users entitled to create the payment types it supports (Wire Dom, Wire Intl, Drawdown).
- Preconditions:
  - Test users with different entitlements.
- Test Data: N/A (UI test)
- Steps:
  1. Login as users with varying entitlements and view Import maps list.
  2. Confirm whether "Wires from Template" appears or not.
- Expected Result:
  - Map appears only when user is entitled to at least one of the allowed payment types or has appropriate admin permissions.
- Test Type: UI/Access control, Manual/Automated

---
