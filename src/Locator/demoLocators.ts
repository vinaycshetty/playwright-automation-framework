// Auto-generated Playwright-style locators for the demo outer HTML
// Extracted from scripts/templateouterhtml.html

export const demoLocators: Record<string, string> = {
  // Header / summary
  landingHeader: 'h1[data-hook="setLandingText"]',
  paymentTotal: '[data-field="summary-amount"]',
  paymentCurrency: '[data-field="summary-currency"]',

  // Originator / widgets
  compidWidget: '[data-qa="widget-dropdown-COMPIDNAME"]',
  compidSelectField: '[data-qa="USACH-BATCH-BDACHCC-mdf-BATCH-USACH-BDACHCC-0-COMPIDNAME-select-field"]',
  compidSelectWrapper: '[data-qa="USACH-BATCH-BDACHCC-mdf-BATCH-USACH-BDACHCC-0-COMPIDNAME-select-field-wrapper"]',

  // Basic inputs / ids
  EFFECTIVEDATE: '#EFFECTIVEDATE',
  SAMEDAYACH: '#SAMEDAYACH',
  ENTRYDESC: '#ENTRYDESC',
  COMPDISCDATA: '#COMPDISCDATA',
  COMPDESCDATE: '#COMPDESCDATE',
  BATCHCOMMENT: '#BATCHCOMMENT',

  // Beneficiary fields
  RECEIVCOMPNAME: '#RECEIVCOMPNAME',
  RECEIVABA_hidden: '#RECEIVABA',
  ACCOUNTNUMBER: '#ACCOUNTNUMBER',
  maskedInput: '[data-qa="masked-input"]',
  ACCOUNTTYPE: '#ACCOUNTTYPE',

  // Amounts
  AMOUNT_input: 'input[name="AMOUNT"]',
  AMOUNT_byId: '#AMOUNT-view927',
  AMOUNT_currency: '#AMOUNT_DESTCURRENCYCODE',

  // Message / comments
  MESSAGE: '#MESSAGE',
  TRANCOMMENT: '#TRANCOMMENT',

  // Template / save
  SAVEASTEMPLATE: '#SAVEASTEMPLATE',
  TEMPLATECODE: '#TEMPLATECODE',
  TEMPLATEDESCRIPTION: '#TEMPLATEDESCRIPTION',

  // Beneficiary actions
  ADDBENE: 'button[name="ADDBENE"]',
  CLEARBENE: 'button[name="CLEARBENE"]',
  openAddBeneficiary: 'button[data-action="openAddBeneficiary"]',
  addNewBeneficiary: '.Beneficiary-showAdd button',

  // Primary action buttons (prefer data-action attributes)
  submitButton: 'button[data-action="save"]',
  saveForLaterButton: 'button[data-action="savedraft"]',
  cancelButton: 'button[data-action="cancel"]',
  widgetActionBtnGroup: '.widget-action-btn-group',

  // Misc data-qa hooks from header/menu
  logoHeader: '[data-qa="logoHeader"]',
  logoContainer: '[data-qa="logo-container"]',
  menuHeader: '[data-qa="menuHeader"]',
  menubarContainer: '[data-qa="menubar-container"]',
  notificationsButton: '[data-qa="notifications-button"]',
  notificationsClose: '[data-qa="notifications-button-close"]',
  typographyComponent: '[data-qa="typography-component"]',

  // Generic helpers
  anyDataQa: '[data-qa]',
  anyDataTestId: '[data-testid]',

  // Regions
  customRegionDiv: '#customRegionDiv',
  footerModalRegion: '[data-region="footerModalRegion"]',
};

export default demoLocators;
