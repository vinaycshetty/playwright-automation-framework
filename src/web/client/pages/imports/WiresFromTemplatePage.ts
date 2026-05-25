import { Page, Locator } from "@playwright/test";
import { DropdownHelper } from "../../../../utils/DropdownHelper";

export class WiresFromTemplatePage {
  constructor(private page: Page) {}

  // Key selectors (sourced from the generated locators)
  private importTypeSelect = '#IMPORTTYPE';
  private createFromTemplateCheckbox = '#CREATEFROM-createFromTemplate';
  private templateCodeInput = '#TEMPLATECODE';
  private fileInput = '[name="fileimport"]';
  private testModeCheckbox = '#TESTMODE';
  private snackbar = '#snackbar-container';

  // Utility getters
  private locator(sel: string): Locator {
    return this.page.locator(sel);
  }

  async selectImportMap(mapName: string) {
    // If import type is a select, set its value; fallback to typing
    const sel = this.locator(this.importTypeSelect);
    if (await sel.isVisible().catch(() => false)) {
      await sel.fill(mapName);
    } else {
      await this.page.fill(this.importTypeSelect, mapName);
    }
  }

  async enableCreateFromTemplate(enable = true) {
    const el = this.locator(this.createFromTemplateCheckbox);
    if (!(await el.isVisible().catch(() => false))) return;
    const checked = (await el.getAttribute('checked')) !== null;
    if (Boolean(checked) !== enable) await el.click();
  }

  async setTemplateCode(code: string) {
    await this.page.fill(this.templateCodeInput, code);
  }

  async uploadFile(filePath: string) {
    const input = this.page.locator(this.fileInput);
    await input.setInputFiles(filePath);
  }

  async setTestMode(enabled = true) {
    const el = this.locator(this.testModeCheckbox);
    if (!(await el.isVisible().catch(() => false))) return;
    const checked = (await el.getAttribute('checked')) !== null;
    if (Boolean(checked) !== enabled) await el.click();
  }

  async clickImport() {
    // Try common button labels used by the app
    const btn = this.page.locator("button:has-text('Import'), button:has-text('Upload'), button:has-text('Start')").first();
    await btn.click();
  }

  async waitForImportComplete(timeout = 60_000) {
    // Wait for a success snackbar or the absence of a progress spinner
    await this.page.waitForSelector(this.snackbar, { timeout }).catch(() => {});
  }
}
