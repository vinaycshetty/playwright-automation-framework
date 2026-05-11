import { Page, Locator, expect } from "@playwright/test";

export class DropdownHelper {
  static async selectByTyping(page: Page, input: Locator, value: string) {
    // 1️⃣ Focus the combobox input
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeVisible({ timeout: 10000 });
    await input.click({ force: true });

    // 2️⃣ Clear and type value
    await input.fill("");
    await input.type(value, { delay: 50 });

    // 3️⃣ Give UI a moment to resolve suggestions
    await page.waitForTimeout(300);

    // 4️⃣ Keyboard selection (works even if listbox is not visible)
    // await input.press("ArrowDown");
    await input.press("Enter");

    // 5️⃣ Assert value applied (important stability check)
    await expect(input).toHaveAttribute("placeholder",new RegExp(value), {
      timeout: 10000,
    });
  }
}
