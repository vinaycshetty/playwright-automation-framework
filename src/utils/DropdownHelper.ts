import { Page, Locator, expect } from "@playwright/test";

export class DropdownHelper {
  static async selectByTyping(page: Page, input: Locator, value: string) {
    await input.scrollIntoViewIfNeeded();
    await expect(input).toBeVisible();
    await input.click();
    

    // 🔍 Detect dropdown type
    const isGLUDropdown = await input.getAttribute("role");

    if (isGLUDropdown === "combobox") {
      // =============================
      // ✅ GLU DROPDOWN (your first one)
      // =============================
      await expect(input).toBeFocused();
      await input.fill("");
      await input.type(value, { delay: 50 });

      await expect(input).toHaveAttribute("aria-expanded", "true");

      const option = page
        .locator('[role="option"]', { hasText: value })
        .first();
      await option.waitFor({ state: "visible", timeout: 5000 });
      await option.click();

      // 5️⃣ Assert value applied (important stability check)
      await expect(input).toHaveAttribute("placeholder", new RegExp(value), {
        timeout: 10000,
      });
    } else {
      // =============================
      // ✅ SELECT2 DROPDOWN (your second one)
      // =============================

      // 2️⃣ Use the dynamically created search input
      const searchInput = page
        .locator(".select2-drop-active .select2-input:visible")
        .first();

      await expect(searchInput).toBeVisible({ timeout: 5000 });
      await searchInput.fill(value);

      // 3️⃣ Wait and click option
      const option = page
        .locator(".select2-result-label", { hasText: value })
        .first();

      await expect(option).toBeVisible({ timeout: 5000 });
      await option.click();

      // 4️⃣ Validate selected value in UI
      const selected = input.locator(".select2-chosen");

      await expect(selected).toHaveText(new RegExp(value), {
        timeout: 10000,
      });
    }
  }
}
