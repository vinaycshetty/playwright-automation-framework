import { test, expect } from "../../../../core/fixtures/baseFixture";
import { CashConcentrationFlow } from "../../flows/CashConcentrationFlow";
import { LoginFlow } from "../../flows/LoginFlow";
import { NavigationFlow } from "../../flows/NavigationFlow";
import { AddPaymentFlow } from "../../flows/AddPaymentFlow";

test("Create Cash Concentration Payment", async ({page,executionContext,login,testData,}) => {
  await createCashConcentration({page,executionContext,login,testData,component: "PAYMENT",});
});

test("Create Cash Concentration Template", async ({page,executionContext,login,testData,}) => {
  await createCashConcentration({page,executionContext,login,testData,component: "TEMPLATE",});
});


async function createCashConcentration({
  page,
  executionContext,
  login,
  testData,
  component,
}: any) {
  const creds = await login.get("feederUETR");

  // Pull payment test data from Postgres. Replace `cc_smoke_001` and the table
  // name with whatever your test-data schema uses; SQL is parameterized.
  const data = await testData.one(
    `SELECT *
       FROM test_data_freeform
      WHERE test_data_id = $1`,
    ["create_freeform_cc_payment"],
  );

  await LoginFlow.login(page, {
    url: executionContext.environment.client_url,
    userGroup: creds.user_group,
    user: creds.user,
    password: creds.password,
  });

  await expect(page.locator(".landing-header")).toHaveText("Home");
  await NavigationFlow.goToPaymentManagement(page);
  await AddPaymentFlow.add(page, "Cash Concentration", component);
  data.multi_bene = "false";
  const result = await CashConcentrationFlow.createCashConcentrationPayment(
    page,
    data,
    component,
  );

  const expectedMessage = component === "PAYMENT" ? "Payment submitted" : "Template submitted";

  expect(result.status.toLowerCase()).toBe(expectedMessage.toLowerCase());
  expect(result.paymentType).toContain(data.payment_type);
};
