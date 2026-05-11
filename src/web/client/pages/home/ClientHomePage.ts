import { Page } from '@playwright/test';

export class ClientHomePage {
  constructor(private page: Page) {}

  async navPaymentManagement() {
    await this.page.goto(
      this.page.url() + '/PAYMENTS/managePayments'
    );
  }
}