import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  private userGroupInput = "input[name='realm']";
  private usernameInput = "input[name='username']";
  private passwordInput = "input[name='password']";
  private loginButton = "button:has-text('Sign In')";
  private splashImage = "//div[contains(@id,'-close-button')]";

  async enterUserGroup(userGroup: string) {
    await this.page.fill(this.userGroupInput, userGroup);
  }

  async enterUsername(username: string) {
    await this.page.fill(this.usernameInput, username);
  }

  async enterPassword(password: string) {
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin() {
    await this.page.click(this.loginButton);
  }

  async closeSplashIfPresent() {
    const splashCloseButton = this.page.locator(this.splashImage);
    if (await splashCloseButton.isVisible()) {
      await splashCloseButton.click();
    }
  }

  /**
   * Logs out of the current app session. Useful for tests that switch from
   * admin to client (or vice versa) within the same Page.
   */
  async logout() {
    // Adjust selectors when the actual logout UI is wired up.
    const logoutBtn = this.page
      .locator(
        "button:has-text('Sign Out'), a:has-text('Sign Out'), button:has-text('Logout')",
      )
      .first();
    if (await logoutBtn.isVisible().catch(() => false)) {
      await logoutBtn.click();
      await this.page.waitForLoadState("networkidle");
    }
  }
}
