import { Page } from "@playwright/test";
import { WireDomesticResult } from "../../../models/WireDomesticResult";

export class WireDomesticConfirmationPage {
  constructor(private page: Page) {}

  private statusSelector = 'div[role="alert"] p';
  private amountSelector = 'div p:has-text("Amount:"), span:has-text("Amount:")';
  private paymentTypeSelector = 'p:has-text("Payment Type:")';
  private valueDateSelector = 'div p:has-text("Value Date:"), div p:has-text("Payment Date:")';
  private paymentIdSelector = 'p:has-text("ID")';
  private invalidAccountWarningSelector = 'div p:has-text("Warning"), div.warningMessage + p, div.errorMessage + p';
  private templateCodeSelector = 'div p:has-text("Template Code")';

  private async getText(selector: string): Promise<string> {
    return (await this.page.textContent(selector))?.trim() || "";
  }

  async getPaymentResults(): Promise<WireDomesticResult> {
    const result: WireDomesticResult = {
      status: await this.getText(this.statusSelector),
      amount: (await this.getText(this.amountSelector)).split(":")[1]?.trim() || "",
      paymentType: (await this.getText(this.paymentTypeSelector)).split(":")[1]?.trim() || "",
      valueDate: this.extractValue(await this.getText(this.valueDateSelector))?.split(":")[1]?.trim() || "",
      paymentId: this.extractValue(await this.getText(this.paymentIdSelector))?.split(":")[1]?.trim() || "",
    };

    if (await this.page.isVisible(this.invalidAccountWarningSelector)) {
      result.invalidAccountMessage = await this.getText(this.invalidAccountWarningSelector);
    }

    return result;
  }

  async getTemplateResults(): Promise<WireDomesticResult> {
    return {
      status: await this.getText(this.statusSelector),
      amount: await this.getText(this.amountSelector),
      paymentType: await this.getText(this.paymentTypeSelector),
      templateCode: await this.getText(this.templateCodeSelector),
    };
  }

  private extractValue(text: string): string | undefined {
    const parts = text.split(":");
    return parts.length > 1 ? parts[1].trim() : undefined;
  }
}
