// flows/LoginFlow.ts
import { Page } from "@playwright/test";
import { LoginPage } from "../pages/login/LoginPage";

export class LoginFlow {
  static async login(
    page: Page,
    loginData: {
      url: string;
      userGroup: string;
      user: string;
      password: string;
    },
  ) {
    await page.goto(loginData.url);

    const loginPage = new LoginPage(page);
    await loginPage.enterUserGroup(loginData.userGroup);
    await loginPage.enterUsername(loginData.user);
    await loginPage.enterPassword(loginData.password);
    await loginPage.clickLogin();
    await page.waitForLoadState("networkidle");
    await loginPage.closeSplashIfPresent();
  }
}
