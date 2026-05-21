---
description: "Scaffold a new web UI test spec for the Bottomline DGB client app. Use when adding a new payment type test, template test, or any web flow test."
argument-hint: "payment type, e.g. Wire Transfer"
agent: "agent"
---

Scaffold a new Playwright web test spec for the Bottomline DGB **client** app.

Follow all conventions in [web.instructions.md](../.github/instructions/web.instructions.md).

## Inputs

The user has requested: **$args**

Infer the following from the argument and the existing codebase if not explicitly provided:

| Input                      | How to resolve                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------- |
| **Payment type**           | From `$args`                                                                        |
| **Component**              | Default to both `PAYMENT` and `TEMPLATE` variants, like `CashConcentration.spec.ts` |
| **Test data table**        | Search `src/web/client/tests/` for an existing similar spec; ask if not found       |
| **Test data ID**           | Ask the user if not obvious from `$args`                                            |
| **Login key / feeder key** | Default to `feeder1` / `"feederUETR"` unless user specifies otherwise               |
| **Flow class**             | Search `src/web/client/flows/` for a matching flow; note if one needs to be created |

## Output

Generate a spec file at `src/web/client/tests/payments/<PaymentType>.spec.ts`.

### Structure to follow

```ts
import { test, expect } from "../../../../core/fixtures/baseFixture";
import { <PaymentType>Flow } from "../../flows/<PaymentType>Flow";
import { LoginFlow } from "../../flows/LoginFlow";
import { NavigationFlow } from "../../flows/NavigationFlow";
import { AddPaymentFlow } from "../../flows/AddPaymentFlow";
import { getFeeder } from "../../../../utils/feederHelper";

test("@smoke Create <PaymentType> Payment", async ({ page, executionContext, login, testData }) => {
  await create<PaymentType>({ page, executionContext, login, testData, component: "PAYMENT" });
});

test("Create <PaymentType> Template", async ({ page, executionContext, login, testData }) => {
  await create<PaymentType>({ page, executionContext, login, testData, component: "TEMPLATE" });
});

async function create<PaymentType>({
  page,
  executionContext,
  login,
  testData,
  component,
}: {
  page: any;
  executionContext: any;
  login: any;
  testData: any;
  component: "PAYMENT" | "TEMPLATE";
}) {
  // 1. Credentials
  const creds = await login.get(getFeeder("<loginKey>", 1));

  // 2. Test data from Postgres — parameterized query
  const data = await testData.one(
    "SELECT * FROM <schema>.<table> WHERE test_data_id = $1",
    ["<testDataId>"]
  );

  // 3. Login
  await LoginFlow.login(page, {
    url: executionContext.environment.client_url,
    userGroup: creds.user_group,
    user: creds.user,
    password: creds.password,
  });

  // 4. Assert landing page, then navigate
  await expect(page.locator(".landing-header")).toHaveText("Home");
  await NavigationFlow.goToPaymentManagement(page);
  await AddPaymentFlow.add(page, "<Payment Type Label>", component);

  // 5. Execute flow and assert
  const result = await <PaymentType>Flow.create<PaymentType>(page, data, component);

  const expectedMessage = component === "PAYMENT" ? "Payment submitted" : "Template submitted";
  expect(result.status.toLowerCase()).toBe(expectedMessage.toLowerCase());
}
```

## Rules

- Do **not** use `: any` on the `test(...)` fixture destructure — use the typed helper function pattern above.
- Do **not** leave `test.only` in the generated file.
- Do **not** hardcode URLs, credentials, or amounts — all must come from DB fixtures.
- Always use parameterized SQL (`$1`, `$2`), never string interpolation.
- If the required Flow class does not yet exist in `src/web/client/flows/`, note that it needs to be created and provide a stub following the pattern in [CashConcentrationFlow.ts](../src/web/client/flows/CashConcentrationFlow.ts).

## After generating

Tell the user:

1. The path of the generated spec file.
2. Which flows already exist vs. which need to be created.
3. What test data table and ID they need to configure in Postgres.
