import { APIRequestContext, APIResponse, request } from "@playwright/test";
import { ExecutionContext } from "../context/ExecutionContext";
import { Logger } from "../logger/logger";

export type ApiTarget = "client" | "admin" | "hub" | "clientStrict" | "tyk";

/**
 * BaseApiClient
 *
 * Thin wrapper around Playwright's APIRequestContext that:
 *   - Resolves the base URL from ExecutionContext (no hardcoded URLs).
 *   - Logs every request + response timing.
 *   - Applies sensible default JSON headers.
 *
 * Create with `BaseApiClient.create(ctx, logger)`; dispose with `dispose()`.
 */
export class BaseApiClient {
  private constructor(
    private readonly api: APIRequestContext,
    private readonly baseURL: string,
    private readonly logger: Logger,
  ) {}

  static async create(
    ctx: ExecutionContext,
    logger: Logger,
    target: ApiTarget = "client",
    extraHeaders: Record<string, string> = {},
  ): Promise<BaseApiClient> {
    const baseURL = BaseApiClient.resolveBaseURL(ctx, target);
    const api = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        ...extraHeaders,
      },
      ignoreHTTPSErrors: true,
    });
    logger.info(`API client created (target=${target}, baseURL=${baseURL})`);
    return new BaseApiClient(api, baseURL, logger.child("api"));
  }

  private static resolveBaseURL(
    ctx: ExecutionContext,
    target: ApiTarget,
  ): string {
    const env = ctx.environment;
    switch (target) {
      case "client":
        return env.api_client_base_uri;
      case "admin":
        return env.api_admin_base_uri;
      case "hub":
        return env.api_hub_base_uri;
      case "clientStrict":
        return env.api_client_strict_uri;
      case "tyk":
        return env.tyk_api_strict_uri;
    }
  }

  async post(
    url: string,
    options?: {
      data?: unknown;
      headers?: Record<string, string>;
    },
  ): Promise<APIResponse> {
    return this.timed("POST", url, () =>
      this.api.post(url, {
        data: options?.data,
        headers: {
          ...options?.headers, // ✅ ONLY custom headers
        },
      }),
    );
  }

  async get(url: string): Promise<APIResponse> {
    return this.timed("GET", url, () => this.api.get(url));
  }

  async put(url: string, body?: unknown): Promise<APIResponse> {
    return this.timed("PUT", url, () => this.api.put(url, { data: body }));
  }

  async delete(url: string): Promise<APIResponse> {
    return this.timed("DELETE", url, () => this.api.delete(url));
  }

  raw(): APIRequestContext {
    return this.api;
  }

  async dispose(): Promise<void> {
    await this.api.dispose();
  }

  private async timed(
    method: string,
    url: string,
    fn: () => Promise<APIResponse>,
  ): Promise<APIResponse> {
    const started = Date.now();
    this.logger.info(`-> ${method} ${url}`);
    const response = await fn();
    const ms = Date.now() - started;
    this.logger.info(`<- ${method} ${url} ${response.status()} (${ms}ms)`);
    return response;
  }
}
