import { APIRequestContext } from "@playwright/test";

export class APIModule {
  constructor(
    private api: APIRequestContext,
    private logger: any,
  ) {}

  async apiRequest(testData: Record<string, any>, token: string, requestTemplate: any) {
    this.logger.info("Adding the payment...");

    const requestBody = this.transformReqBody(
      requestTemplate, // JSON template
      testData,
      );
      this.logger.info(`Transformed Request Body: ${JSON.stringify(requestBody)}`);
console.log("Token in APIModule:", token);
    const response = await this.api.post(testData.add_payment_end_point, {
      data: requestBody,
      headers: {
        "__token__": token,
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });

    const body = await response.text();
    this.logger.info(`Payment Response: ${body}`);

    return { response, body };
  }

  transformReqBody(template: any, testData: Record<string, any>) {
    // simple replacement logic (you can improve later)
    let payload = JSON.stringify(template);

    for (const key in testData) {
      payload = payload.replace(
        new RegExp(`\\$\\{${key}\\}`, "g"),
        String(testData[key]),
      );
    }

    return JSON.parse(payload);
  }
}
