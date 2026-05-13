import { Page } from "@playwright/test";
import { DropdownHelper } from "../../../../../utils/DropdownHelper";

export class CashConcentrationPage {
  constructor(private page: Page) {}

  private templateCodeInput = '[name="TEMPLATE_CODE"], [name="TEMPLATECODE"]';
  private templateDescriptionInput =
    '[name="TEMPLATE_DESCRIPTION"], [name="TEMPLATEDESCRIPTION"]';
  private originatorSelect =
    'input[data-qa*="COMPIDNAME-select-field"], button[data-qa*="BATCH-USACH-BDACHCC"]';
  private batchDescriptionInput = "#ENTRYDESC";
  private commentsInput = "#BATCHCOMMENT";
  private beneficiaryNameInput = "#RECEIVCOMPNAME";
  private beneficiaryIdInput = "#RECEIVCOMPID";
  private accountNumberInput = "#ACCOUNTNUMBER";
  private beneCompIdInput = "#s2id_RECEIVABA";
  private beneAcctTypeInput = "#s2id_ACCOUNTTYPE";
  private amountInput = 'input[name="AMOUNT"]';
  private submitButton = 'button[name="save"]';
  private saveForLaterButton = 'button[name="savedraft"]';
  private addBeneButton = "#ADDBENE";

  // ----- Header / Base payment -----

  async selectOriginator(originatorId: string) {
    await DropdownHelper.selectByTyping(
      this.page,
      this.page.locator(this.originatorSelect),
      originatorId,
    );
  }

  async setBatchDescription(desc: string) {
    await this.page.fill(this.batchDescriptionInput, desc);
  }

  async setComments(comment: string) {
    await this.page.fill(this.commentsInput, comment);
  }

  // ----- Beneficiary -----

  async setBeneficiaryName(value: string) {
    await this.page.fill(this.beneficiaryNameInput, value);
  }

  async setBeneficiaryId(value: string) {
    await this.page.fill(this.beneficiaryIdInput, value);
  }

  async setBeneficiaryBank(value: string) {
    await DropdownHelper.selectByTyping(
      this.page,
      this.page.locator(this.beneCompIdInput),
      value,
    );
  }

  async setAccountNumber(value: string) {
    await this.page.fill(this.accountNumberInput, value);
  }

  async setAccountType(value: string) {
    await DropdownHelper.selectByTyping(
      this.page,
      this.page.locator(this.beneAcctTypeInput),
      value,
    );
  }

  async setAmount(value: string) {
    await this.page.fill(this.amountInput, value);
  }

  async addAnotherBeneficiary() {
    await this.page.click(this.addBeneButton);
  }

  async setTemplateCode(value: string) {
    await this.page.fill(this.templateCodeInput, value);
  }

  async setTemplateDescription(value: string) {
    await this.page.fill(this.templateDescriptionInput, value);
  }

  // ----- Actions -----

  async submit() {
    await this.page.waitForTimeout(1000); // Ensure any UI updates are rendered before clicking submit
    await this.page.click(this.submitButton);
    await this.page.click(this.submitButton); // Click twice to handle any potential flakiness in the submit action
  }

  async saveForLater() {
    await this.page.click(this.saveForLaterButton);
  }
}
