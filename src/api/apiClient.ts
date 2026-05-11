import { APIRequestContext } from "@playwright/test";

export class ApiClient {
  constructor(private api: APIRequestContext) {}

  async post(url: string, body: any) {
    return await this.api.post(url, { data: body });
  }

  async get(url: string) {
    return await this.api.get(url);
  }
}
