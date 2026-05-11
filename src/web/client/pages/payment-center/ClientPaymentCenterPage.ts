import { Page } from '@playwright/test';

export class ClientPaymentCenterPage {
  constructor(private page: Page) {}

  async navAddPayment() {
    await this.page.getByText("Add a New Payment").click();
  }

  async navAddTemplate() {
    await this.page.getByText("Add a New Template").click();
  }
}