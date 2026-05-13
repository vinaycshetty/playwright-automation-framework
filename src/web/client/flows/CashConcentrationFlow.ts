import { Page } from '@playwright/test';
import { CashConcentrationPage } from '../pages/payments/Cash-Concentration/CashConcentrationPage';
import { CashConcentrationConfirmationPage } from
  '../pages/payments/Cash-Concentration/CashConcentrationConfirmationPage';
import { CashConcentrationResult } from '../models/CashConcentrationResult';

export class CashConcentrationFlow {

  static async createCashConcentrationPayment(
    page: Page,
    paymentData: any,
    component: string
  ): Promise<CashConcentrationResult> {

    const ccPage = new CashConcentrationPage(page);

    // ----- Template logic -----
    if (component === 'TEMPLATE') {
        const unique = Math.random().toString(36).substring(2, 8);
        await ccPage.setTemplateCode(unique);
        await ccPage.setTemplateDescription(unique);
    }

    // ----- Base payment fields -----
    await ccPage.selectOriginator(paymentData.ach_comp_id);
    await ccPage.setBatchDescription(paymentData.batch_desc);
    await ccPage.setComments(paymentData.comment);

    // ----- Beneficiaries -----
    const beneNames = paymentData.bene_name.split(',');
    if (paymentData.multi_bene === "true") {
      for (let i = 0; i < beneNames.length; i++) {
        await setBeneficiaryDetails(i);

        if (i < beneNames.length - 1) {
          await ccPage.addAnotherBeneficiary();
        }
        await page.waitForTimeout(1000); // Small wait to ensure the new beneficiary form is ready before filling
      }
    } else {
       await setBeneficiaryDetails(0);
    }

    async function setBeneficiaryDetails(index: number) {
      await ccPage.setBeneficiaryName(beneNames[index]);
      await ccPage.setBeneficiaryId(paymentData.bene_id.split(",")[index]);
      await ccPage.setBeneficiaryBank(paymentData.comp_aba.split(",")[index]);
      await ccPage.setAccountNumber(paymentData.bene_acct_num.split(",")[index]);
      await ccPage.setAccountType(paymentData.bene_acct_type.split(",")[index]);
      await ccPage.setAmount(paymentData.amount.split(",")[index]);
    }
     

    // ----- Submit or Save -----
    if (paymentData.create_save_for_later === 'true') {
      await ccPage.saveForLater();
    } else {
      await ccPage.submit();
    }

    // ----- Confirmation -----
    const confirmPage =
      new CashConcentrationConfirmationPage(page);

    return component === 'PAYMENT'
      ? confirmPage.getPaymentResults()
      : confirmPage.getTemplateResults();
  }
}