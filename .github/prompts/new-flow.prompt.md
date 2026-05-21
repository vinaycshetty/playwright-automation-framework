---
description: "Scaffold a new static Flow class for the web layer. Use when adding a new payment flow, navigation flow, or any multi-page orchestration."
argument-hint: "flow name and purpose, e.g. Wire Transfer payment flow"
agent: "agent"
---

Scaffold a new Flow class for the Bottomline DGB web layer.

Follow all conventions in [web.instructions.md](../instructions/web.instructions.md).

## Inputs

The user has requested: **$args**

Before generating, confirm or infer the following. Ask the user only for what cannot be inferred:

| Input                | How to resolve                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Flow name**        | From `$args`, e.g. `WireTransferFlow`                                                                                                  |
| **App**              | `client` (default) or `admin` — ask if unclear                                                                                         |
| **Pages it uses**    | Search `src/web/{app}/pages/` for relevant existing pages; list what's found and what's missing                                        |
| **Method signature** | Infer from similar flows in `src/web/{app}/flows/`; use `(page: Page, data: Record<string, any>, component: string)` for payment flows |
| **Return type**      | `Promise<void>` for navigation flows; a typed result interface for payment flows that assert on outcome                                |

## Output

Generate the flow file at `src/web/{client|admin}/flows/<FlowName>.ts`.

### Pattern — simple navigation flow

```ts
import { Page } from "@playwright/test";
import { SomePage } from "../pages/section/SomePage";

export class <Name>Flow {
  static async <action>(page: Page): Promise<void> {
    const somePage = new SomePage(page);
    await somePage.someMethod();
  }
}
```

### Pattern — payment flow with typed result

```ts
import { Page } from "@playwright/test";
import { <Payment>Page } from "../pages/payments/<Payment>/<Payment>Page";
import { <Payment>ConfirmationPage } from "../pages/payments/<Payment>/<Payment>ConfirmationPage";
import { <Payment>Result } from "../models/<Payment>Result";

export class <Payment>Flow {
  static async create<Payment>(
    page: Page,
    paymentData: Record<string, any>,
    component: string
  ): Promise<<Payment>Result> {
    const formPage = new <Payment>Page(page);

    if (component === "TEMPLATE") {
      const unique = Math.random().toString(36).substring(2, 8);
      await formPage.setTemplateCode(unique);
      await formPage.setTemplateDescription(unique);
    }

    // Fill form fields from paymentData
    // ...

    if (paymentData.create_save_for_later === "true") {
      await formPage.saveForLater();
    } else {
      await formPage.submit();
    }

    const confirmPage = new <Payment>ConfirmationPage(page);
    return component === "PAYMENT"
      ? confirmPage.getPaymentResults()
      : confirmPage.getTemplateResults();
  }
}
```

If a result interface is needed, also create `src/web/{app}/models/<Payment>Result.ts`:

```ts
export interface <Payment>Result {
  status: string;
  paymentType: string;
  amount?: string;
  paymentId?: string;
}
```

## Rules

- Flow methods must be `static` — never instantiate a flow class.
- Flows receive `page: Page` and plain data — never fixtures directly.
- Do not hardcode URLs, amounts, or credentials inside flows.
- If a required page object does not exist yet, note it and provide a stub.

## After generating

Tell the user:

1. The path of the generated flow file.
2. Which page objects already exist vs. which stubs need to be created.
3. Whether a result model was created.
