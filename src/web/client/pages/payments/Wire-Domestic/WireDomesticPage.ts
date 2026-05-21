import { Page } from "@playwright/test";
import { DropdownHelper } from "../../../../../utils/DropdownHelper";

export class WireDomesticPage {
  constructor(private page: Page) {}

  private templateCodeInput = '[name="TEMPLATE_CODE"], [name="TEMPLATECODE"]';
  private templateDescriptionInput = '[name="TEMPLATE_DESCRIPTION"], [name="TEMPLATEDESCRIPTION"]';
  private beneficiaryNameInput = '#BENENAME, [name="beneficiary_name"]';
  private accountNumberInput = '#ACCOUNTNUMBER, [name="account_number"]';
  private amountInput = 'input[name="AMOUNT"]';
  private submitButton = 'button[name="save"]';
  private saveForLaterButton = 'button[name="savedraft"]';

  async setTemplateCode(value: string) {
    await this.page.fill(this.templateCodeInput, value);
  }

  async setTemplateDescription(value: string) {
    await this.page.fill(this.templateDescriptionInput, value);
  }

  async setBeneficiaryName(value: string) {
    await this.page.fill(this.beneficiaryNameInput, value);
  }

  async setAccountNumber(value: string) {
    await this.page.fill(this.accountNumberInput, value);
  }

  async setAmount(value: string) {
    await this.page.fill(this.amountInput, value);
  }

  async submit() {
    await this.page.waitForTimeout(500);
    await this.page.click(this.submitButton);
    await this.page.click(this.submitButton);
  }

  async saveForLater() {
    await this.page.click(this.saveForLaterButton);
  }
}
