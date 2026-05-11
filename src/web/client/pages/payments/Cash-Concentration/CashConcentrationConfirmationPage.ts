import { Page } from '@playwright/test';
import { CashConcentrationResult } from '../../../models/CashConcentrationResult';

export class CashConcentrationConfirmationPage {
  constructor(private page: Page) {}

  private async getText(selector: string): Promise<string> {
    return (await this.page.textContent(selector))?.trim() || '';
  }

  async getPaymentResults(): Promise<CashConcentrationResult> {
    const result: CashConcentrationResult = {
      status: await this.getText('#statusValue'),
      amount: await this.getText('#amountValue'),
      paymentType: await this.getText('#paymentTypeValue'),
      valueDate: this.extractValue(await this.getText('#valueDate')),
      paymentId: this.extractValue(await this.getText('#paymentId'))
    };

    if (await this.page.isVisible('#invalidAccountWarning')) {
      result.invalidAccountMessage =
        await this.getText('#invalidAccountWarning');
    }

    return result;
  }

  async getTemplateResults(): Promise<CashConcentrationResult> {
    return {
      status: await this.getText('#statusValue'),
      amount: await this.getText('#amountValue'),
      paymentType: await this.getText('#paymentTypeValue')
    };
  }

  private extractValue(text: string): string | undefined {
    const parts = text.split(':');
    return parts.length > 1 ? parts[1].trim() : undefined;
  }
}