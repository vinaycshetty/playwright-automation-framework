import { Page } from "@playwright/test";

export class CashConcentrationPageGenerated {
  constructor(private page: Page) {}

  private IMPORTTYPE = '#IMPORTTYPE';
  private SUBTYPE = '#SUBTYPE';
  private OPTIONIMPORTMETHOD_FILE = '#OPTIONIMPORTMETHOD-File';
  private OPTIONIMPORTMETHOD_INDIVIDUALPAYMENTS = '#OPTIONIMPORTMETHOD-IndividualPayments';
  private OPTIONIMPORTMETHODNFI_INDIVIDUALBATCHES = '#OPTIONIMPORTMETHODNFI-IndividualBatches';
  private OPTIONIMPORTMETHODNFI_PASSTHROUGH = '#OPTIONIMPORTMETHODNFI-PassThrough';
  private CONFIDENTIALIMPORTS_0 = '#CONFIDENTIALIMPORTS-0';
  private CONFIDENTIALIMPORTS_1 = '#CONFIDENTIALIMPORTS-1';
  private ALLOWDUPLICATEIMPORT = '#ALLOWDUPLICATEIMPORT';
  private CREATEFROM_CREATEFROMMANUALENTRY = '#CREATEFROM-createFromManualEntry';
  private CREATEFROM_CREATEFROMTEMPLATE = '#CREATEFROM-createFromTemplate';
  private TEMPLATECODE = '#TEMPLATECODE';
  private TEMPLATEDESCRIPTION = '#TEMPLATEDESCRIPTION';
  private ORIGCOMPNAME = '#ORIGCOMPNAME';
  private ORIGCOMPID = '#ORIGCOMPID';
  private OFFSETACCOUNTNUM = '#OFFSETACCOUNTNUM';
  private EFFECTIVEDATE = '#EFFECTIVEDATE';
  private SAMEDAYACH = '#SAMEDAYACH';
  private UE_COMPDISCDATA = '#UE_COMPDISCDATA';
  private COMPDESCDATE = '#COMPDESCDATE';
  private UE_ENTRYDESC = '#UE_ENTRYDESC';
  private BATCHCOMMENT = '#BATCHCOMMENT';
  private TESTMODE = '#TESTMODE';
  private FILESELECTION = '#FILESELECTION';
  private REMITTANCE_FILE_SELECTION = '#REMITTANCE_FILE_SELECTION';
  private LOGOHEADER = '[data-qa="logoHeader"]';
  private LOGO_CONTAINER = '[data-qa="logo-container"]';
  private MENUHEADER = '[data-qa="menuHeader"]';
  private MENUBAR_CONTAINER = '[data-qa="menubar-container"]';
  private USERMENUHEADER = '[data-qa="userMenuHeader"]';
  private USERMENU_CONTAINER = '[data-qa="userMenu-container"]';
  private NOTIFICATIONDIRECTOR = '[data-qa="notificationDirector"]';
  private NOTIFICATIONS_BUTTON = '[data-qa="notifications-button"]';
  private TYPOGRAPHY_COMPONENT = '[data-qa="typography-component"]';
  private NOTIFICATIONS_BUTTON_CLOSE = '[data-qa="notifications-button-close"]';
  private ACCORDION_3 = '[data-qa="accordion-3"]';
  private ACCORDION_4 = '[data-qa="accordion-4"]';
  private ACCORDION_5 = '[data-qa="accordion-5"]';
  private MAIN = '#main';
  private FOOTER = '#footer';
  private AG_2040_BUTTON = '#ag-2040-button';
  private BUTTON_3 = '[data-qa="button-3"]';
  private BUTTON_7 = '[data-qa="button-7"]';
  private BUTTON_5 = '[data-qa="button-5"]';
  private BUTTON_9 = '[data-qa="button-9"]';
  private BUTTON_11 = '[data-qa="button-11"]';
  private BUTTON_27 = '[data-qa="button-27"]';
  private BUTTON_17 = '[data-qa="button-17"]';
  private BUTTON_13 = '[data-qa="button-13"]';
  private BUTTON_15 = '[data-qa="button-15"]';
  private BUTTON_19 = '[data-qa="button-19"]';
  private BUTTON_21 = '[data-qa="button-21"]';
  private BUTTON_23 = '[data-qa="button-23"]';
  private BUTTON_25 = '[data-qa="button-25"]';
  private ROOT = '#root';
  private NAV = '#nav';
  private GLU_MENU_TOGGLE_WRAP = '[data-qa="glu-menu-toggle-wrap"]';
  private GLU_MENU_TOGGLE_BTN = '[data-qa="glu-menu-toggle-btn"]';
  private FLYOUTHEADER = '[data-qa="flyoutHeader"]';
  private NOTIFICATIONS_BUTTON_ICON = '[data-qa="notifications-button-icon"]';
  private CONTROLBAR = '[data-qa="controlBar"]';
  private UNDEFINED_POPOVER_WRAPPER = '#undefined-popover-wrapper';
  private AG_2042 = '#ag-2042';
  private S2ID_FUNCTIONCODE = '#s2id_FUNCTIONCODE';
  private S2ID_AUTOGEN1 = '#s2id_autogen1';
  private S2ID_AUTOGEN1_SEARCH = '#s2id_autogen1_search';
  private S2ID_CMB_TEMPLATE_CODE = '#s2id_CMB_TEMPLATE_CODE';
  private S2ID_AUTOGEN2 = '#s2id_autogen2';
  private S2ID_AUTOGEN2_SEARCH = '#s2id_autogen2_search';
  private S2ID_COMPIDNAME = '#s2id_COMPIDNAME';
  private S2ID_AUTOGEN3 = '#s2id_autogen3';
  private S2ID_AUTOGEN3_SEARCH = '#s2id_autogen3_search';
  private S2ID_COMPIDNAME_EFT = '#s2id_COMPIDNAME_EFT';
  private S2ID_AUTOGEN4 = '#s2id_autogen4';
  private S2ID_AUTOGEN4_SEARCH = '#s2id_autogen4_search';
  private S2ID_COMPIDNAME_PRM = '#s2id_COMPIDNAME_PRM';
  private S2ID_AUTOGEN5 = '#s2id_autogen5';
  private S2ID_AUTOGEN5_SEARCH = '#s2id_autogen5_search';
  private S2ID_OFFSETACCOUNTNUM_EFTCC = '#s2id_OFFSETACCOUNTNUM_EFTCC';
  private S2ID_AUTOGEN6 = '#s2id_autogen6';
  private S2ID_AUTOGEN6_SEARCH = '#s2id_autogen6_search';
  private S2ID_OFFSETACCOUNTNUM_EFTCCD = '#s2id_OFFSETACCOUNTNUM_EFTCCD';
  private S2ID_AUTOGEN7 = '#s2id_autogen7';
  private S2ID_AUTOGEN7_SEARCH = '#s2id_autogen7_search';
  private S2ID_OFFSETACCOUNTNUM_EFTCD = '#s2id_OFFSETACCOUNTNUM_EFTCD';
  private S2ID_AUTOGEN8 = '#s2id_autogen8';
  private S2ID_AUTOGEN8_SEARCH = '#s2id_autogen8_search';
  private S2ID_TRANCODELIVE = '#s2id_TRANCODELIVE';
  private S2ID_AUTOGEN9 = '#s2id_autogen9';
  private S2ID_AUTOGEN9_SEARCH = '#s2id_autogen9_search';
  private AG_2044_LABEL = '#ag-2044-label';
  private SELECT2_CHOSEN_1 = '#select2-chosen-1';
  private SELECT2_CHOSEN_2 = '#select2-chosen-2';
  private SELECT2_CHOSEN_3 = '#select2-chosen-3';
  private SELECT2_CHOSEN_4 = '#select2-chosen-4';
  private SELECT2_CHOSEN_5 = '#select2-chosen-5';
  private SELECT2_CHOSEN_6 = '#select2-chosen-6';
  private SELECT2_CHOSEN_7 = '#select2-chosen-7';
  private SELECT2_CHOSEN_8 = '#select2-chosen-8';
  private SELECT2_CHOSEN_9 = '#select2-chosen-9';
  private AG_2042_START_PAGE = '#ag-2042-start-page';
  private AG_2044_DISPLAY = '#ag-2044-display';
  private AG_2042_TO = '#ag-2042-to';
  private AG_2042_LAST_ROW = '#ag-2042-last-row';
  private AG_2042_OF = '#ag-2042-of';
  private AG_2042_ROW_COUNT = '#ag-2042-row-count';
  private AG_2042_OF_PAGE = '#ag-2042-of-page';
  private AG_2042_FIRST_ROW = '#ag-2042-first-row';
  private AG_2042_START_PAGE_NUMBER = '#ag-2042-start-page-number';
  private AG_2042_OF_PAGE_NUMBER = '#ag-2042-of-page-number';
  private FILEIMPORT = '[name="fileimport"]';
  private AG_2037_INPUT = '#ag-2037-input';
  private MODAL_CONTENT = '#modal-content';
  private SNACKBAR_CONTAINER = '#snackbar-container';
  private MICROSITE_ROOT = '#microsite-root';
  private POPOVERS_DEFAULT_CONTAINER = '#popovers-default-container';
  private FILEIMPORTREFRESH = '[name="fileimportrefresh"]';
  private CANCEL = '[name="cancel"]';
  private RADIOSELECTION = '[name="radioSelection"]';
  private DIV_250 = 'div.ag-wrapper.ag-picker-field-wrapper.ag-picker-collapsed';
  private A_SKIP_TO_MA = 'a[href="#main"]';
  private A_BACK_TO_PR = 'a[href="#"]';
  private BUTTON_YOUR_PRIVA = 'button.ot-sdk-show-settings.btn-tertiary';
  private A_PRIVACY_AN = 'a[href="https://www.bottomline.com"]';
  private A___SELECT__ = 'a[href="javascript:void(0)"]';
  private BUTTON_APPLY = 'button.applyBtn.btn.btn-sm.btn-primary';
  private BUTTON_26 = 'button.btn.btn-small.btn-sm';
  private BUTTON_27_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_28 = 'button.btn.btn-small.btn-sm';
  private BUTTON_29 = 'button.btn.btn-small.btn-sm';
  private BUTTON_30 = 'button.btn.btn-small.btn-sm';
  private BUTTON_10 = 'button.btn.btn-small.btn-sm';
  private BUTTON_11_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_12 = 'button.btn.btn-small.btn-sm';
  private BUTTON_13_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_14 = 'button.btn.btn-small.btn-sm';
  private BUTTON_15_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_16 = 'button.btn.btn-small.btn-sm';
  private BUTTON_17_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_18 = 'button.btn.btn-small.btn-sm';
  private BUTTON_19_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_20 = 'button.btn.btn-small.btn-sm';
  private BUTTON_21_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_22 = 'button.btn.btn-small.btn-sm';
  private BUTTON_23_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_24 = 'button.btn.btn-small.btn-sm';
  private BUTTON_25_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_31 = 'button.btn.btn-small.btn-sm';
  private BUTTON_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_2 = 'button.btn.btn-small.btn-sm';
  private BUTTON_3_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_4 = 'button.btn.btn-small.btn-sm';
  private BUTTON_5_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_6 = 'button.btn.btn-small.btn-sm';
  private BUTTON_7_1 = 'button.btn.btn-small.btn-sm';
  private BUTTON_8 = 'button.btn.btn-small.btn-sm';
  private BUTTON_9_1 = 'button.btn.btn-small.btn-sm';

  async set_IMPORTTYPE(value: string) { await this.page.fill(this.IMPORTTYPE, value); }
  async set_SUBTYPE(value: string) { await this.page.fill(this.SUBTYPE, value); }
  async set_OPTIONIMPORTMETHOD_FILE(value: string) { await this.page.fill(this.OPTIONIMPORTMETHOD_FILE, value); }
  async set_OPTIONIMPORTMETHOD_INDIVIDUALPAYMENTS(value: string) { await this.page.fill(this.OPTIONIMPORTMETHOD_INDIVIDUALPAYMENTS, value); }
  async set_OPTIONIMPORTMETHODNFI_INDIVIDUALBATCHES(value: string) { await this.page.fill(this.OPTIONIMPORTMETHODNFI_INDIVIDUALBATCHES, value); }
  async set_OPTIONIMPORTMETHODNFI_PASSTHROUGH(value: string) { await this.page.fill(this.OPTIONIMPORTMETHODNFI_PASSTHROUGH, value); }
  async set_CONFIDENTIALIMPORTS_0(value: string) { await this.page.fill(this.CONFIDENTIALIMPORTS_0, value); }
  async set_CONFIDENTIALIMPORTS_1(value: string) { await this.page.fill(this.CONFIDENTIALIMPORTS_1, value); }
  async set_ALLOWDUPLICATEIMPORT(value: string) { await this.page.fill(this.ALLOWDUPLICATEIMPORT, value); }
  async set_CREATEFROM_CREATEFROMMANUALENTRY(value: string) { await this.page.fill(this.CREATEFROM_CREATEFROMMANUALENTRY, value); }
  async set_CREATEFROM_CREATEFROMTEMPLATE(value: string) { await this.page.fill(this.CREATEFROM_CREATEFROMTEMPLATE, value); }
  async set_TEMPLATECODE(value: string) { await this.page.fill(this.TEMPLATECODE, value); }
  async set_TEMPLATEDESCRIPTION(value: string) { await this.page.fill(this.TEMPLATEDESCRIPTION, value); }
  async set_ORIGCOMPNAME(value: string) { await this.page.fill(this.ORIGCOMPNAME, value); }
  async set_ORIGCOMPID(value: string) { await this.page.fill(this.ORIGCOMPID, value); }
  async set_OFFSETACCOUNTNUM(value: string) { await this.page.fill(this.OFFSETACCOUNTNUM, value); }
  async set_EFFECTIVEDATE(value: string) { await this.page.fill(this.EFFECTIVEDATE, value); }
  async set_SAMEDAYACH(value: string) { await this.page.fill(this.SAMEDAYACH, value); }
  async set_UE_COMPDISCDATA(value: string) { await this.page.fill(this.UE_COMPDISCDATA, value); }
  async set_COMPDESCDATE(value: string) { await this.page.fill(this.COMPDESCDATE, value); }
  async set_UE_ENTRYDESC(value: string) { await this.page.fill(this.UE_ENTRYDESC, value); }
  async set_BATCHCOMMENT(value: string) { await this.page.fill(this.BATCHCOMMENT, value); }
  async set_TESTMODE(value: string) { await this.page.fill(this.TESTMODE, value); }
  async set_FILESELECTION(value: string) { await this.page.fill(this.FILESELECTION, value); }
  async set_REMITTANCE_FILE_SELECTION(value: string) { await this.page.fill(this.REMITTANCE_FILE_SELECTION, value); }
  async click_LOGOHEADER() { await this.page.click(this.LOGOHEADER); }
  async click_LOGO_CONTAINER() { await this.page.click(this.LOGO_CONTAINER); }
  async click_MENUHEADER() { await this.page.click(this.MENUHEADER); }
  async click_MENUBAR_CONTAINER() { await this.page.click(this.MENUBAR_CONTAINER); }
  async click_USERMENUHEADER() { await this.page.click(this.USERMENUHEADER); }
  async click_USERMENU_CONTAINER() { await this.page.click(this.USERMENU_CONTAINER); }
  async click_NOTIFICATIONDIRECTOR() { await this.page.click(this.NOTIFICATIONDIRECTOR); }
  async click_NOTIFICATIONS_BUTTON() { await this.page.click(this.NOTIFICATIONS_BUTTON); }
  async click_TYPOGRAPHY_COMPONENT() { await this.page.click(this.TYPOGRAPHY_COMPONENT); }
  async click_NOTIFICATIONS_BUTTON_CLOSE() { await this.page.click(this.NOTIFICATIONS_BUTTON_CLOSE); }
  async click_ACCORDION_3() { await this.page.click(this.ACCORDION_3); }
  async click_ACCORDION_4() { await this.page.click(this.ACCORDION_4); }
  async click_ACCORDION_5() { await this.page.click(this.ACCORDION_5); }
  async click_MAIN() { await this.page.click(this.MAIN); }
  async click_FOOTER() { await this.page.click(this.FOOTER); }
  async click_AG_2040_BUTTON() { await this.page.click(this.AG_2040_BUTTON); }
  async click_BUTTON_3() { await this.page.click(this.BUTTON_3); }
  async click_BUTTON_7() { await this.page.click(this.BUTTON_7); }
  async click_BUTTON_5() { await this.page.click(this.BUTTON_5); }
  async click_BUTTON_9() { await this.page.click(this.BUTTON_9); }
  async click_BUTTON_11() { await this.page.click(this.BUTTON_11); }
  async click_BUTTON_27() { await this.page.click(this.BUTTON_27); }
  async click_BUTTON_17() { await this.page.click(this.BUTTON_17); }
  async click_BUTTON_13() { await this.page.click(this.BUTTON_13); }
  async click_BUTTON_15() { await this.page.click(this.BUTTON_15); }
  async click_BUTTON_19() { await this.page.click(this.BUTTON_19); }
  async click_BUTTON_21() { await this.page.click(this.BUTTON_21); }
  async click_BUTTON_23() { await this.page.click(this.BUTTON_23); }
  async click_BUTTON_25() { await this.page.click(this.BUTTON_25); }
  async click_ROOT() { await this.page.click(this.ROOT); }
  async click_NAV() { await this.page.click(this.NAV); }
  async click_GLU_MENU_TOGGLE_WRAP() { await this.page.click(this.GLU_MENU_TOGGLE_WRAP); }
  async click_GLU_MENU_TOGGLE_BTN() { await this.page.click(this.GLU_MENU_TOGGLE_BTN); }
  async click_FLYOUTHEADER() { await this.page.click(this.FLYOUTHEADER); }
  async click_NOTIFICATIONS_BUTTON_ICON() { await this.page.click(this.NOTIFICATIONS_BUTTON_ICON); }
  async click_CONTROLBAR() { await this.page.click(this.CONTROLBAR); }
  async click_UNDEFINED_POPOVER_WRAPPER() { await this.page.click(this.UNDEFINED_POPOVER_WRAPPER); }
  async click_AG_2042() { await this.page.click(this.AG_2042); }
  async click_S2ID_FUNCTIONCODE() { await this.page.click(this.S2ID_FUNCTIONCODE); }
  async set_S2ID_AUTOGEN1(value: string) { await this.page.fill(this.S2ID_AUTOGEN1, value); }
  async set_S2ID_AUTOGEN1_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN1_SEARCH, value); }
  async click_S2ID_CMB_TEMPLATE_CODE() { await this.page.click(this.S2ID_CMB_TEMPLATE_CODE); }
  async set_S2ID_AUTOGEN2(value: string) { await this.page.fill(this.S2ID_AUTOGEN2, value); }
  async set_S2ID_AUTOGEN2_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN2_SEARCH, value); }
  async click_S2ID_COMPIDNAME() { await this.page.click(this.S2ID_COMPIDNAME); }
  async set_S2ID_AUTOGEN3(value: string) { await this.page.fill(this.S2ID_AUTOGEN3, value); }
  async set_S2ID_AUTOGEN3_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN3_SEARCH, value); }
  async click_S2ID_COMPIDNAME_EFT() { await this.page.click(this.S2ID_COMPIDNAME_EFT); }
  async set_S2ID_AUTOGEN4(value: string) { await this.page.fill(this.S2ID_AUTOGEN4, value); }
  async set_S2ID_AUTOGEN4_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN4_SEARCH, value); }
  async click_S2ID_COMPIDNAME_PRM() { await this.page.click(this.S2ID_COMPIDNAME_PRM); }
  async set_S2ID_AUTOGEN5(value: string) { await this.page.fill(this.S2ID_AUTOGEN5, value); }
  async set_S2ID_AUTOGEN5_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN5_SEARCH, value); }
  async click_S2ID_OFFSETACCOUNTNUM_EFTCC() { await this.page.click(this.S2ID_OFFSETACCOUNTNUM_EFTCC); }
  async set_S2ID_AUTOGEN6(value: string) { await this.page.fill(this.S2ID_AUTOGEN6, value); }
  async set_S2ID_AUTOGEN6_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN6_SEARCH, value); }
  async click_S2ID_OFFSETACCOUNTNUM_EFTCCD() { await this.page.click(this.S2ID_OFFSETACCOUNTNUM_EFTCCD); }
  async set_S2ID_AUTOGEN7(value: string) { await this.page.fill(this.S2ID_AUTOGEN7, value); }
  async set_S2ID_AUTOGEN7_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN7_SEARCH, value); }
  async click_S2ID_OFFSETACCOUNTNUM_EFTCD() { await this.page.click(this.S2ID_OFFSETACCOUNTNUM_EFTCD); }
  async set_S2ID_AUTOGEN8(value: string) { await this.page.fill(this.S2ID_AUTOGEN8, value); }
  async set_S2ID_AUTOGEN8_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN8_SEARCH, value); }
  async click_S2ID_TRANCODELIVE() { await this.page.click(this.S2ID_TRANCODELIVE); }
  async set_S2ID_AUTOGEN9(value: string) { await this.page.fill(this.S2ID_AUTOGEN9, value); }
  async set_S2ID_AUTOGEN9_SEARCH(value: string) { await this.page.fill(this.S2ID_AUTOGEN9_SEARCH, value); }
  async click_AG_2044_LABEL() { await this.page.click(this.AG_2044_LABEL); }
  async click_SELECT2_CHOSEN_1() { await this.page.click(this.SELECT2_CHOSEN_1); }
  async click_SELECT2_CHOSEN_2() { await this.page.click(this.SELECT2_CHOSEN_2); }
  async click_SELECT2_CHOSEN_3() { await this.page.click(this.SELECT2_CHOSEN_3); }
  async click_SELECT2_CHOSEN_4() { await this.page.click(this.SELECT2_CHOSEN_4); }
  async click_SELECT2_CHOSEN_5() { await this.page.click(this.SELECT2_CHOSEN_5); }
  async click_SELECT2_CHOSEN_6() { await this.page.click(this.SELECT2_CHOSEN_6); }
  async click_SELECT2_CHOSEN_7() { await this.page.click(this.SELECT2_CHOSEN_7); }
  async click_SELECT2_CHOSEN_8() { await this.page.click(this.SELECT2_CHOSEN_8); }
  async click_SELECT2_CHOSEN_9() { await this.page.click(this.SELECT2_CHOSEN_9); }
  async click_AG_2042_START_PAGE() { await this.page.click(this.AG_2042_START_PAGE); }
  async click_AG_2044_DISPLAY() { await this.page.click(this.AG_2044_DISPLAY); }
  async click_AG_2042_TO() { await this.page.click(this.AG_2042_TO); }
  async click_AG_2042_LAST_ROW() { await this.page.click(this.AG_2042_LAST_ROW); }
  async click_AG_2042_OF() { await this.page.click(this.AG_2042_OF); }
  async click_AG_2042_ROW_COUNT() { await this.page.click(this.AG_2042_ROW_COUNT); }
  async click_AG_2042_OF_PAGE() { await this.page.click(this.AG_2042_OF_PAGE); }
  async click_AG_2042_FIRST_ROW() { await this.page.click(this.AG_2042_FIRST_ROW); }
  async click_AG_2042_START_PAGE_NUMBER() { await this.page.click(this.AG_2042_START_PAGE_NUMBER); }
  async click_AG_2042_OF_PAGE_NUMBER() { await this.page.click(this.AG_2042_OF_PAGE_NUMBER); }
  async click_FILEIMPORT() { await this.page.click(this.FILEIMPORT); }
  async set_AG_2037_INPUT(value: string) { await this.page.fill(this.AG_2037_INPUT, value); }
  async click_MODAL_CONTENT() { await this.page.click(this.MODAL_CONTENT); }
  async click_SNACKBAR_CONTAINER() { await this.page.click(this.SNACKBAR_CONTAINER); }
  async click_MICROSITE_ROOT() { await this.page.click(this.MICROSITE_ROOT); }
  async click_POPOVERS_DEFAULT_CONTAINER() { await this.page.click(this.POPOVERS_DEFAULT_CONTAINER); }
  async click_FILEIMPORTREFRESH() { await this.page.click(this.FILEIMPORTREFRESH); }
  async click_CANCEL() { await this.page.click(this.CANCEL); }
  async set_RADIOSELECTION(value: string) { await this.page.fill(this.RADIOSELECTION, value); }
  async click_DIV_250() { await this.page.click(this.DIV_250); }
  async click_A_SKIP_TO_MA() { await this.page.click(this.A_SKIP_TO_MA); }
  async click_A_BACK_TO_PR() { await this.page.click(this.A_BACK_TO_PR); }
  async click_noAllPaymentDetailsWillBeVisibleToAllUsers() { await this.page.getByText("No - All payment details will be visible to all users").click(); }
  async click_yesBeneficiaryReceiverDetailsWillOnlyBeVisibleToUsersWithConfidentialAccess() { await this.page.getByText("Yes - Beneficiary / Receiver details will only be visible to users with Confidential access").click(); }
  async click_acceptPossibleDuplicatePaymentsDuringFileImport() { await this.page.getByText("Accept possible duplicate payments during file import").click(); }
  async click_templateDescription() { await this.page.getByText("Template Description").click(); }
  async click_processEligiblePaymentsAsSameDay() { await this.page.getByText("Process eligible payments as Same Day").click(); }
  async click_companyDiscretionaryData() { await this.page.getByText("Company Discretionary Data").click(); }
  async click_loadTheFileInTestMode() { await this.page.getByText("Load the file in test mode.").click(); }
  async click_selectRemittanceFile() { await this.page.getByText("Select Remittance File").click(); }
  async click_BUTTON_YOUR_PRIVA() { await this.page.click(this.BUTTON_YOUR_PRIVA); }
  async click_A_PRIVACY_AN() { await this.page.click(this.A_PRIVACY_AN); }
  async click_individualPayments() { await this.page.getByText("Individual Payments").click(); }
  async click_individualBatches() { await this.page.getByText("Individual Batches").click(); }
  async click_selectImportFile() { await this.page.getByText("Select Import File").click(); }
  async click_batchDescription() { await this.page.getByText("Batch Description").click(); }
  async click_descriptiveDate() { await this.page.getByText("Descriptive Date").click(); }
  async click_transactionCode() { await this.page.getByText("Transaction Code").click(); }
  async click_fundingAccount() { await this.page.getByText("Funding Account").click(); }
  async click_offsetAccount() { await this.page.getByText("Offset Account").click(); }
  async click_templateCode() { await this.page.getByText("Template Code").click(); }
  async click_originatorID() { await this.page.getByText("Originator ID").click(); }
  async click_passThrough() { await this.page.getByText("Pass-Through").click(); }
  async click_manualEntry() { await this.page.getByText("Manual Entry").click(); }
  async click_companyName() { await this.page.getByText("Company Name").click(); }
  async click_achCompany() { await this.page.getByText("ACH Company").click(); }
  async click_A___SELECT__() { await this.page.click(this.A___SELECT__); }
  async click_valueDate() { await this.page.getByText("Value Date").click(); }
  async click_importAs() { await this.page.getByText("Import As").click(); }
  async click_template() { await this.page.getByText("Template").click(); }
  async click_comments() { await this.page.getByText("Comments").click(); }
  async click_BUTTON_APPLY() { await this.page.click(this.BUTTON_APPLY); }
  async click_file() { await this.page.getByText("File").click(); }
  async click_from() { await this.page.getByText("From").click(); }
  async click_BUTTON_26() { await this.page.click(this.BUTTON_26); }
  async click_BUTTON_27_1() { await this.page.click(this.BUTTON_27_1); }
  async click_BUTTON_28() { await this.page.click(this.BUTTON_28); }
  async click_BUTTON_29() { await this.page.click(this.BUTTON_29); }
  async click_BUTTON_30() { await this.page.click(this.BUTTON_30); }
  async click_BUTTON_10() { await this.page.click(this.BUTTON_10); }
  async click_BUTTON_11_1() { await this.page.click(this.BUTTON_11_1); }
  async click_BUTTON_12() { await this.page.click(this.BUTTON_12); }
  async click_BUTTON_13_1() { await this.page.click(this.BUTTON_13_1); }
  async click_BUTTON_14() { await this.page.click(this.BUTTON_14); }
  async click_BUTTON_15_1() { await this.page.click(this.BUTTON_15_1); }
  async click_BUTTON_16() { await this.page.click(this.BUTTON_16); }
  async click_BUTTON_17_1() { await this.page.click(this.BUTTON_17_1); }
  async click_BUTTON_18() { await this.page.click(this.BUTTON_18); }
  async click_BUTTON_19_1() { await this.page.click(this.BUTTON_19_1); }
  async click_BUTTON_20() { await this.page.click(this.BUTTON_20); }
  async click_BUTTON_21_1() { await this.page.click(this.BUTTON_21_1); }
  async click_BUTTON_22() { await this.page.click(this.BUTTON_22); }
  async click_BUTTON_23_1() { await this.page.click(this.BUTTON_23_1); }
  async click_BUTTON_24() { await this.page.click(this.BUTTON_24); }
  async click_BUTTON_25_1() { await this.page.click(this.BUTTON_25_1); }
  async click_BUTTON_31() { await this.page.click(this.BUTTON_31); }
  async click_to() { await this.page.getByText("To").click(); }
  async click_BUTTON_1() { await this.page.click(this.BUTTON_1); }
  async click_BUTTON_2() { await this.page.click(this.BUTTON_2); }
  async click_BUTTON_3_1() { await this.page.click(this.BUTTON_3_1); }
  async click_BUTTON_4() { await this.page.click(this.BUTTON_4); }
  async click_BUTTON_5_1() { await this.page.click(this.BUTTON_5_1); }
  async click_BUTTON_6() { await this.page.click(this.BUTTON_6); }
  async click_BUTTON_7_1() { await this.page.click(this.BUTTON_7_1); }
  async click_BUTTON_8() { await this.page.click(this.BUTTON_8); }
  async click_BUTTON_9_1() { await this.page.click(this.BUTTON_9_1); }

  // TODO: Review selectors above for stability and add domain-specific helpers.
}
