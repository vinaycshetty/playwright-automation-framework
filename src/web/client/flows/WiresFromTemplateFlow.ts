import { Page } from "@playwright/test";
import { WiresFromTemplatePage } from "../pages/imports/WiresFromTemplatePage";
import { NavigationFlow } from "./NavigationFlow";

export class WiresFromTemplateFlow {
  static async importFromTemplate(
    page: Page,
    filePath: string,
    opts?: { mapName?: string; templateCode?: string; testMode?: boolean },
  ) {
    // Navigate to Payments / Import area
    await NavigationFlow.goToPaymentManagement(page);

    const pageObj = new WiresFromTemplatePage(page);

    if (opts?.mapName) await pageObj.selectImportMap(opts.mapName);
    if (opts?.templateCode) await pageObj.setTemplateCode(opts.templateCode);
    if (opts?.testMode) await pageObj.setTestMode(opts.testMode);

    await pageObj.uploadFile(filePath);
    await pageObj.enableCreateFromTemplate(true);
    await pageObj.clickImport();
    await pageObj.waitForImportComplete();

    return { status: "imported" };
  }
}
