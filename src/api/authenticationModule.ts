import { APIResponse } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { BaseApiClient } from "../core/base/BaseApiClient";
import { Logger } from "../core/logger/logger";
import { transformRequest } from "../utils/requestTemplateUtil";

const REQUEST_TEMPLATES_DIR = path.resolve("src/api/requests");
const LOGIN_PATH = "/banking-services/api/security/login";

export interface AuthResult {
  response: APIResponse;
  token: string;
}

/**
 * Authenticates against the client banking-services login endpoint.
 *
 * - Base URL is provided by the BaseApiClient (resolved from ExecutionContext).
 * - Request body is built from a JSON template in `src/api/requests/`,
 *   substituting `{{key}}` placeholders with `testData`.
 */
export class AuthenticationModule {
  constructor(
    private readonly api: BaseApiClient,
    private readonly logger: Logger,
  ) {}

  async authenticate(
    testData: Record<string, unknown>,
    templateName = "client-login.json",
  ): Promise<AuthResult> {
    this.logger.info(
      `Authenticating: [${testData.userGroup}:${testData.userId}] template=${templateName}`,
    );

    const templatePath = path.join(REQUEST_TEMPLATES_DIR, templateName);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Request template not found: ${templatePath}`);
    }
    const template = fs.readFileSync(templatePath, "utf-8");
    const body = transformRequest(template, testData);

    
const response = await this.api.post(LOGIN_PATH, {
  data: body,
});


    let parsed: any;
    try {
      parsed = await response.json();
    } catch (e) {
      const text = await response.text();
      throw new Error(
        `Login response was not JSON. status=${response.status()} body=${text.slice(0, 500)}`,
      );
    }

    const token: string | undefined = parsed?.token;
    if (!token) {
      throw new Error(
        `Login response missing 'token'. status=${response.status()} body=${JSON.stringify(parsed).slice(0, 500)}`,
      );
    }

    return { response, token };
  }
}
