# TC-NH-250271-16 — Matrix: Permission combinations for Import / Create-from-Template

- Objective: Exhaustive matrix testing of permission permutations (Import: Y/N, CreateFromTemplate: Y/N, entitlement per payment type).
- Preconditions:
  - Test users configured for combinations of permissions and entitlements.
- Test Data: Valid file referencing Approved templates.
- Steps:
  1. For each permission combination, attempt to view import maps and run import.
  2. Record whether map is visible and whether import proceeds.
- Expected Result:
  - Map visibility and import behavior align with defined security model (Import permission required to see/execute; CreateFromTemplate required for created payment types).
- Test Type: Security/Regression, Manual/Automated

---
