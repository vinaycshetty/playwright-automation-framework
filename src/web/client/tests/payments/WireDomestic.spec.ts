import { test, expect } from "../../../../core/fixtures/baseFixture";
import { WireDomesticFlow } from "../../flows/WireDomesticFlow";
import { LoginFlow } from "../../flows/LoginFlow";
import { NavigationFlow } from "../../flows/NavigationFlow";
import { AddPaymentFlow } from "../../flows/AddPaymentFlow";
import { getFeeder } from "../../../../utils/feederHelper";

test("@smoke Create Wire Domestic Payment", async ({ page, executionContext, login, testData }) => {
  await createWireDomestic({ page, executionContext, login, testData, component: "PAYMENT" });
});

test("Create Wire Domestic Template", async ({ page, executionContext, login, testData }) => {
  await createWireDomestic({ page, executionContext, login, testData, component: "TEMPLATE" });
});

async function createWireDomestic({
  page,
  executionContext,
  login,
  testData,
  component,
}: any) {
  const creds = await login.get(getFeeder("feederUETR", 1));

  // TODO: Replace the table name and test_data_id with your project's test data row
  const data = await testData.one(
    `SELECT * FROM test_data_freeform WHERE test_data_id = $1`,
    ["create_wire_domestic_payment"],
  );

  await LoginFlow.login(page, {
    url: executionContext.environment.client_url,
    userGroup: creds.user_group,
    user: creds.user,
    password: creds.password,
  });

  await expect(page.locator(".landing-header")).toHaveText("Home");
  await NavigationFlow.goToPaymentManagement(page);
  await AddPaymentFlow.add(page, "Wire Domestic", component);

  const result = await WireDomesticFlow.createWireDomesticPayment(page, data, component);

  const expectedMessage = component === "PAYMENT" ? "Payment submitted" : "Template submitted";
  expect(result.status.toLowerCase()).toBe(expectedMessage.toLowerCase());
  if (component === "PAYMENT") {
    expect(result.paymentType).toContain(data.payment_type);
  }
}
