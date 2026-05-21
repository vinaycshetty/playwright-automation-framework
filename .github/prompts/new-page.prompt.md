---
description: "Scaffold a new Page Object class for the web layer. Use when adding a new page, form, modal, or confirmation screen to client or admin."
argument-hint: "page name and purpose, e.g. Wire Transfer form page"
agent: "agent"
---

Scaffold a new Page Object for the Bottomline DGB web layer.

Follow all conventions in [web.instructions.md](../instructions/web.instructions.md).

## Step 1 — Collect inputs

The user has requested: **$args**

**Ask the user the following questions before generating** (ask all at once in a single message):

1. **App**: Should this page go under `src/web/client/` or `src/web/admin/`?
2. **Section subfolder**: Which section folder under `pages/` should it live in?
   Common options: `payments/<PaymentType>/`, `payment-center/`, `home/`, `login/` — or a new folder name.
3. **Navigation**: Does this page need to navigate to a URL?
   - **Yes** → extend `BasePage` (needs `ExecutionContext` for URL resolution)
   - **No** → simple page with `constructor(private page: Page)` only
4. **Selectors**: List the key UI elements and actions this page should expose (e.g. "input for amount, dropdown for account, submit button").

## Step 2 — Generate

Once inputs are confirmed, generate the page at:
`src/web/{client|admin}/pages/{section}/{PageName}Page.ts`

### Pattern A — Simple page (no URL navigation)

```ts
import { Page } from "@playwright/test";

export class <Name>Page {
  constructor(private page: Page) {}

  // Selectors — private, defined as strings
  private <field>Input = '<css-or-xpath-selector>';
  private <field>Button = '<css-or-xpath-selector>';

  async set<Field>(value: string): Promise<void> {
    await this.page.fill(this.<field>Input, value);
  }

  async click<Action>(): Promise<void> {
    await this.page.click(this.<field>Button);
  }
}
```

### Pattern B — Full page (navigates to a URL, needs logging)

```ts
import { Page } from "@playwright/test";
import { BasePage } from "../../../../core/base/BasePage";
import { ExecutionContext } from "../../../../core/context/ExecutionContext";
import { Logger } from "../../../../core/logger/logger";

export class <Name>Page extends BasePage {
  constructor(page: Page, ctx: ExecutionContext, logger: Logger) {
    super(page, ctx, logger);
  }

  private <field>Input = '<css-or-xpath-selector>';

  async goto(): Promise<void> {
    await this.gotoPath("/relative/path");
  }

  async set<Field>(value: string): Promise<void> {
    await this.page.fill(this.<field>Input, value);
  }

  async click<Action>(): Promise<void> {
    await this.safeClick(this.page.locator(this.<field>Button));
  }
}
```

## Rules

- All selectors are `private` string fields declared at the top of the class.
- Prefer `data-qa` attributes for selectors when available; fall back to `id`, `name`, then structural XPath.
- Use `this.safeClick(locator)` (Pattern B) or `await this.page.click(selector)` (Pattern A) — never bare `.click()` without a wait on flaky elements.
- Use `this.gotoPath()` for any URL navigation — never `page.goto()` with a hardcoded string.
- One page class = one screen or modal. Split confirmation screens into their own class.

## After generating

Tell the user:

1. The full path of the generated file.
2. Which pattern was used (A or B) and why.
3. Any selectors left as `TODO` that the user needs to fill in from the browser.
