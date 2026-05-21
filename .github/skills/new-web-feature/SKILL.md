---
name: new-web-feature
description: "End-to-end workflow for implementing a new web UI feature test in the Bottomline DGB framework. Use when adding a new payment type, template flow, or any new web screen from scratch — covers pages, flows, and the spec file in one guided workflow."
argument-hint: "feature name, e.g. Wire Transfer payment"
---

# New Web Feature Workflow

Guides you through implementing a complete new web feature test — from page objects to flow to spec — following all framework conventions.

## When to Use

- Adding a new payment type (Wire, SEPA, Book Transfer, etc.)
- Adding a new template flow for an existing payment
- Adding any new web screen that needs pages, flows, and a spec

## Workflow

### Step 1 — Understand the Feature

Gather context before writing any code. Ask the user:

1. What is the **payment type or feature name**?
2. Which **app**: `client` or `admin`?
3. Does it support both a **PAYMENT and TEMPLATE** variant?
4. What are the key **form fields** the user fills in?
5. What is the **success assertion** (e.g. confirmation message text)?
6. What **Postgres table and test data ID** holds the test data?

---

### Step 2 — Inventory Existing Assets

Before creating anything, search the codebase:

```
src/web/{app}/pages/          ← page objects
src/web/{app}/flows/          ← flow classes
src/web/{app}/models/         ← result interfaces
src/web/{app}/tests/payments/ ← existing spec files
```

Produce a checklist:

| Asset                                           | Exists? | Action        |
| ----------------------------------------------- | ------- | ------------- |
| Form page (`<Name>Page.ts`)                     | ✅ / ❌ | Skip / Create |
| Confirmation page (`<Name>ConfirmationPage.ts`) | ✅ / ❌ | Skip / Create |
| Flow class (`<Name>Flow.ts`)                    | ✅ / ❌ | Skip / Create |
| Result model (`<Name>Result.ts`)                | ✅ / ❌ | Skip / Create |
| Spec file (`<Name>.spec.ts`)                    | ✅ / ❌ | Skip / Create |

Show this checklist to the user and confirm before proceeding.

---

### Step 3 — Create Missing Page Objects

For each missing page, follow [new-page.prompt.md](../../prompts/new-page.prompt.md).

**Form page** — typically Pattern A (no URL navigation, simple `page: Page`):

- Private selector fields at the top
- One `async` method per form interaction
- Prefer `data-qa` selectors; fall back to `id`, `name`, then XPath

**Confirmation page** — reads result values after submit:

```ts
async getPaymentResults(): Promise<<Name>Result> {
  return {
    status: await this.page.locator('.status-message').innerText(),
    paymentType: await this.page.locator('.payment-type').innerText(),
    // ...
  };
}

async getTemplateResults(): Promise<<Name>Result> {
  return {
    status: await this.page.locator('.status-message').innerText(),
    // ...
  };
}
```

---

### Step 4 — Create Result Model (if needed)

If the flow returns data that tests assert on, create `src/web/{app}/models/<Name>Result.ts`:

```ts
export interface <Name>Result {
  status: string;
  paymentType: string;
  amount?: string;
  paymentId?: string;
}
```

---

### Step 5 — Create the Flow

Follow [new-flow.prompt.md](../../prompts/new-flow.prompt.md).

A payment flow must:

- Be a `static`-method class — never instantiated
- Accept `(page: Page, data: Record<string, any>, component: string)`
- Handle `TEMPLATE` variant at the top (set code + description before filling fields)
- Handle `create_save_for_later` flag before submit
- Delegate to the confirmation page for the return value

Reference: [CashConcentrationFlow.ts](../../../src/web/client/flows/CashConcentrationFlow.ts)

---

### Step 6 — Create the Spec File

Follow [new-web-test.prompt.md](../../prompts/new-web-test.prompt.md).

Required structure:

1. Import from `../../../../core/fixtures/baseFixture` (not `@playwright/test`)
2. `getFeeder("loginKey", 1)` for credentials
3. Parameterized SQL for test data (`$1`, `$2` — never string interpolation)
4. `LoginFlow.login(...)` → assert `.landing-header` → `NavigationFlow` → `AddPaymentFlow.add` → payment flow
5. Assert `result.status` and `result.paymentType`

---

### Step 7 — Quality Checklist

Before finishing, verify every generated file:

- [ ] No `test.only` in spec files
- [ ] No `console.log(token)` or any credential logging
- [ ] No hardcoded URLs — use `executionContext.environment.client_url`
- [ ] No hardcoded credentials — use `login.get(getFeeder(...))`
- [ ] All SQL uses `$1`/`$2` placeholders, not template literals
- [ ] Fixture destructure has no `: any` type annotation
- [ ] All selectors are `private` fields, not inline strings
- [ ] Flow methods are `static`

---

## File Locations Quick Reference

| File type         | Path                                                            |
| ----------------- | --------------------------------------------------------------- |
| Form page         | `src/web/{app}/pages/payments/<Name>/<Name>Page.ts`             |
| Confirmation page | `src/web/{app}/pages/payments/<Name>/<Name>ConfirmationPage.ts` |
| Flow              | `src/web/{app}/flows/<Name>Flow.ts`                             |
| Result model      | `src/web/{app}/models/<Name>Result.ts`                          |
| Spec              | `src/web/{app}/tests/payments/<Name>.spec.ts`                   |

## Key Conventions Reference

See [web.instructions.md](../../instructions/web.instructions.md) for full details on page object patterns, flow structure, and test conventions.
