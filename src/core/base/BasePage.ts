import { Page, Locator } from "@playwright/test";
import { ExecutionContext } from "../context/ExecutionContext";
import { Logger } from "../logger/logger";

/**
 * BasePage
 *
 * Shared foundation for every Page Object. Pages should:
 *   - extend BasePage
 *   - keep their own selectors as private fields
 *   - delegate URL building / common waits to the helpers here
 */
export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly ctx: ExecutionContext,
    protected readonly logger: Logger,
  ) {}

  /** Returns the base URL for the current app (admin or client). */
  protected baseUrl(): string {
    if (this.ctx.app === "admin") return this.ctx.environment.admin_url;
    return this.ctx.environment.client_url;
  }

  /** Navigate to a path relative to the active app's base URL. */
  protected async gotoPath(relativePath = ""): Promise<void> {
    const base = this.baseUrl().replace(/\/+$/, "");
    const rel = relativePath.replace(/^\/+/, "");
    const url = rel ? `${base}/${rel}` : base;
    this.logger.info(`goto ${url}`);
    await this.page.goto(url);
  }

  /** Click that waits for the locator to be ready. */
  protected async safeClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" });
    await locator.click();
  }

  protected async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
  }
}
