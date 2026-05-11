// flows/NavigationFlow.ts
import { Page } from "@playwright/test";
import { ClientHomePage } from "../pages/home/ClientHomePage";

export class NavigationFlow {
  static async goToPaymentManagement(page: Page) {
    const homePage = new ClientHomePage(page);
    await homePage.navPaymentManagement();
  }
}
