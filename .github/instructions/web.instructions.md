---
applyTo: "src/web/**"
---

# Web Layer Conventions

## Page Objects

Two valid patterns — choose based on whether the page needs URL resolution or logging:

**Simple page** (no URL navigation, no logger needed):

```ts
import { Page } from "@playwright/test";

export class MyPage {
  constructor(private page: Page) {}

  private myButton = 'button[data-qa="my-btn"]';

  async clickMyButton() {
    await this.page.click(this.myButton);
  }
}
```

**Full page** (navigates to a URL or needs a logger — extend `BasePage`):

```ts
import { Page } from "@playwright/test";
import { BasePage } from "../../../../core/base/BasePage";
import { ExecutionContext } from "../../../../core/context/ExecutionContext";
import { Logger } from "../../../../core/logger/logger";

export class MyPage extends BasePage {
  constructor(page: Page, ctx: ExecutionContext, logger: Logger) {
    super(page, ctx, logger);
  }

  async goto() {
    await this.gotoPath("/my/relative/path"); // resolves client_url or admin_url
  }
}
```

- Declare all selectors as `private` string fields at the top of the class.
- Use `this.safeClick(locator)` when you need a visibility wait before clicking.
- Use `this.baseUrl()` / `this.gotoPath(path)` instead of hardcoding URLs.
- Place pages under `src/web/{client|admin}/pages/<section>/MyPage.ts`.

## Flows

Flows are `static`-method classes that orchestrate page objects. Tests call flows, not pages directly.

```ts
import { Page } from "@playwright/test";
import { MyPage } from "../pages/section/MyPage";

export class MyFlow {
  static async doSomething(page: Page, data: Record<string, any>) {
    const myPage = new MyPage(page);
    await myPage.clickMyButton();
    // ...
  }
}
```

- Place flows under `src/web/{client|admin}/flows/MyFlow.ts`.
- Flows receive `page: Page` plus any data they need — they do not receive fixtures directly.
- Return a typed result object when the caller needs to assert on outcome (see `CashConcentrationResult` model for reference).

## Test Structure

```ts
import { test, expect } from "../../../../core/fixtures/baseFixture";
import { getFeeder } from "../../../../utils/feederHelper";
import { LoginFlow } from "../../flows/LoginFlow";

test("My test", async ({ page, executionContext, login, testData }) => {
  // 1. Credentials — support feeder env-var overrides
  const creds = await login.get(getFeeder("my_login_key", 1));

  // 2. Test data from Postgres (always parameterized)
  const data = await testData.one(
    "SELECT * FROM my_schema.my_table WHERE test_data_id = $1",
    ["my_test_key"]
  );

  // 3. Login
  await LoginFlow.login(page, {
    url: executionContext.environment.client_url,
    userGroup: creds.user_group,
    user: creds.user,
    password: creds.password,
  });

  // 4. Navigate and act via flows
  // await NavigationFlow.goTo...(page);
  // await MyFlow.doSomething(page, data);

  // 5. Assert
  expect(...);
});
```

- Import `test`/`expect` from `../../../../core/fixtures/baseFixture` — never from `@playwright/test`.
- Place spec files under `src/web/{client|admin}/tests/`.
- Use `getFeeder("loginKey", n)` so individual feeders can be overridden via `feeder1…feederN` env vars without editing the spec.

## Standard Flows (client)

| Flow                                                                          | Purpose                                   |
| ----------------------------------------------------------------------------- | ----------------------------------------- |
| `LoginFlow.login(page, { url, userGroup, user, password })`                   | Navigate to URL and sign in               |
| `NavigationFlow.goToPaymentManagement(page)`                                  | Click Payment Management nav link         |
| `AddPaymentFlow.add(page, paymentType, component)`                            | Open the Add Payment / Template modal     |
| `CashConcentrationFlow.createCashConcentrationPayment(page, data, component)` | Fill and submit a Cash Concentration form |
