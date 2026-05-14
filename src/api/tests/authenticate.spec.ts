import { test, expect } from "../baseApiTest";
import { AuthenticationModule } from "../authenticationModule";

test("Client login API", async ({ apiClient, login, logger }) => {
  // Pull credentials from the configured login table (no hardcoded creds).
  const creds = await login.get("api1");

  const api = await apiClient.create("client");
  const auth = new AuthenticationModule(api, logger);

  const { response, token } = await auth.authenticate({
    userGroup: creds.user_group,
    userId: creds.user,
    password: creds.password,
  });

  expect(response.ok()).toBeTruthy();
  expect(token).toBeTruthy();
  logger.info(`Authenticated, token length=${token.length}`);
  console.log("Token in authenticate.spec.ts:", token);
});
