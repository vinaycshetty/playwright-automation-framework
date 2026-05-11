import { Page } from '@playwright/test';
import { DropdownHelper } from '../../../../../utils/DropdownHelper';

export class CashConcentrationPage {
    constructor(private page: Page) { }

    private templateCodeInput = '[name="TEMPLATE_CODE"], [name="TEMPLATECODE"]';
    private templateDescriptionInput = '[name="TEMPLATE_DESCRIPTION"], [name="TEMPLATEDESCRIPTION"]';
    private originatorSelect = 'input[data-qa*="COMPIDNAME-select-field"], button[data-qa*="BATCH-USACH-BDACHCC"]';

  // ----- Header / Base payment -----

  async selectOriginator(originatorId: string) {
    await DropdownHelper.selectByTyping(
      this.page,
      this.page.locator(this.originatorSelect),
      originatorId,
    );

  }

  async setBatchDescription(desc: string) {
    await this.page.fill('#batchDesc', desc);
  }

  async setComments(comment: string) {
    await this.page.fill('#comments', comment);
  }

  // ----- Beneficiary -----

  async setBeneficiaryName(value: string) {
    await this.page.fill('#beneCompLocationName', value);
  }

  async setBeneficiaryId(value: string) {
    await this.page.fill('#beneCompLocationID', value);
  }

  async setAccountNumber(value: string) {
    await this.page.fill('#beneCompAcctNum', value);
  }

  async setAccountType(value: string) {
    await this.page.selectOption('#beneAcctType', value);
  }

  async setAmount(value: string) {
    await this.page.fill('#beneAmount', value);
  }

  async addAnotherBeneficiary() {
    await this.page.click('#addAnotherBeneBtn');
    }
    
    async setTemplateCode(value: string) {
    await this.page.fill(this.templateCodeInput, value);
    }
    
    async setTemplateDescription(value: string) {
    await this.page.fill(this.templateDescriptionInput, value);
  }

  // ----- Actions -----

  async submit() {
    await this.page.click('#submitBtn');
  }

  async saveForLater() {
    await this.page.click('#saveForLaterBtn');
  }
}