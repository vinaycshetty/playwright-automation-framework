# TC-NH-250271-17 — Negative: Template name/code mismatch or template name not linked to payment

- Objective: Validate behavior when the Template Code exists but the template's name or linked payment type does not match the expected mapping or fields in file.
- Preconditions:
  - Template exists but has inconsistent metadata (name not linked to payment type expected).
- Test Data: File referencing such a template.
- Steps:
  1. Run import and inspect whether payment produced matches expectations.
- Expected Result:
  - System either resolves via Template Code authoritative mapping or rejects with clear error if mapping inconsistent.
- Test Type: Negative/Edge, Manual/Automated

---
