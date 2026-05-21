import { Page } from "@playwright/test";
import { WireDomesticPage } from "../pages/payments/Wire-Domestic/WireDomesticPage";
import { WireDomesticConfirmationPage } from "../pages/payments/Wire-Domestic/WireDomesticConfirmationPage";
import { WireDomesticResult } from "../models/WireDomesticResult";

export class WireDomesticFlow {
  static async createWireDomesticPayment(
    page: Page,
    paymentData: Record<string, any>,
    component: "PAYMENT" | "TEMPLATE",
  ): Promise<WireDomesticResult> {
    const formPage = new WireDomesticPage(page);

    if (component === "TEMPLATE") {
      const unique = Math.random().toString(36).substring(2, 8);
      await formPage.setTemplateCode(unique);
      await formPage.setTemplateDescription(unique);
    }

    // Fill common fields. Adjust keys to match your test-data schema.
    if (paymentData.beneficiary_name) {
      await formPage.setBeneficiaryName(paymentData.beneficiary_name);
    }
    if (paymentData.account_number) {
      await formPage.setAccountNumber(paymentData.account_number);
    }
    if (paymentData.amount) {
      await formPage.setAmount(paymentData.amount);
    }

    if (paymentData.create_save_for_later === "true") {
      await formPage.saveForLater();
    } else {
      await formPage.submit();
    }

    const confirmPage = new WireDomesticConfirmationPage(page);
    return component === "PAYMENT"
      ? confirmPage.getPaymentResults()
      : confirmPage.getTemplateResults();
  }
}
