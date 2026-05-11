import { Page } from "@playwright/test";

export class ClientAddPaymentModalPage {
  constructor(private page: Page) {}

  private paymentTypeSelector =
    '//div[contains(@class, "container form-control")]//a[contains(@class, "choice select")]//span[contains(@class, "chosen")]';

  async selectPaymentType(paymentType: string) {
    await this.page.click(this.paymentTypeSelector);
    await this.page.click(`//li/div[text()='${paymentType}']`);
    await this.page.waitForLoadState("networkidle");
    await this.page.getByRole("button", { name: "Continue" }).click();
  }
}
