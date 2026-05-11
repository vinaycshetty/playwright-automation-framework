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
    for (let i = 0; i < beneNames.length; i++) {
      await ccPage.setBeneficiaryName(beneNames[i]);
      await ccPage.setBeneficiaryId(
        paymentData.bene_id.split(',')[i]
      );
      await ccPage.setAccountNumber(
        paymentData.bene_acct_num.split(',')[i]
      );
      await ccPage.setAccountType(
        paymentData.bene_acct_type.split(',')[i]
      );
      await ccPage.setAmount(
        paymentData.amount.split(',')[i]
      );

      if (i < beneNames.length - 1) {
        await ccPage.addAnotherBeneficiary();
      }
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