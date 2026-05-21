import { test, expect } from "../baseApiTest";
import { AuthenticationModule } from "../modules/authenticationModule";
import { APIModule } from "../modules/apiModule";
import { getNextBusinessDate } from "../../utils/dateHelper";

test("create_api_dw_payment", async ({
  apiClient,
  login,
  testData,
  logger,
}: any) => {
  // ✅ Step 1: Get DB test data
  const data = await testData.one(`
    SELECT * 
    FROM btschema.test_data_api_payment 
    WHERE test_data_id='create_api_dw_payment'
  `);

  const requestRow = await testData.one(
    ` SELECT request_file
    FROM btschema.test_data_api_request
    WHERE request_file_id = $1
  `,
    [data.add_payment_request_id],
  );

  // ✅ Step 2: Get login from DB
  const creds = await login.get("api1");

  // ✅ Merge login into testData (like Java putAll)
  Object.assign(data, creds);

  // ✅ Step 3: Authenticate
  const api = await apiClient.create("client");
  const auth = new AuthenticationModule(api, logger);

  const { response: loginRes, token } = await auth.authenticate({
    userGroup: data.user_group,
    userId: data.user,
    password: data.password,
  });

  expect(loginRes.ok()).toBeTruthy();
  expect(await loginRes.text()).toContain("Login successful");

  // ✅ Step 4: Prepare dynamic values
  const today = getNextBusinessDate();
  logger.info(`Next business date calculated as: ${today}`);

  data.tran_date = today;
  data.value_date = today;
  data.effective_date = today;

  data.ACCOUNTFILTER = "BONY-1052334504";
  data.DEBIT_ACCOUNT_NUMBER = "1052334504";

  data.amount = Math.floor(Math.random() * 10000 + 100); // random amount

  // ✅ Step 5: Call Payment API
  const apiCall = new APIModule(api, logger);
  console.log("Token in wires.spec.ts:", token);
  const template = requestRow.request_file;
  const { response: paymentRes, body } = await apiCall.apiRequest(
    data,
    token,
    template,
  );

  // ✅ Step 6: Assertions
  expect(paymentRes.ok()).toBeTruthy();
  expect(body).toContain("Payment Submitted");
});


test.only("create_api_iw_payment", async ({
  apiClient,
  login,
  testData,
  logger,
}: any) => {
  // ✅ Step 1: Get DB test data
  const data = await testData.one(`
    SELECT * 
    FROM btschema.test_data_api_payment 
    WHERE test_data_id='create_api_iw_payment'
  `);

  const requestRow = await testData.one(
    ` SELECT request_file
    FROM btschema.test_data_api_request
    WHERE request_file_id = $1
  `,
    [data.add_payment_request_id],
  );

  // ✅ Step 2: Get login from DB
  const creds = await login.get("api1");

  // ✅ Merge login into testData (like Java putAll)
  Object.assign(data, creds);

  // ✅ Step 3: Authenticate
  const api = await apiClient.create("client");
  const auth = new AuthenticationModule(api, logger);

  const { response: loginRes, token } = await auth.authenticate({
    userGroup: data.user_group,
    userId: data.user,
    password: data.password,
  });

  expect(loginRes.ok()).toBeTruthy();
  expect(await loginRes.text()).toContain("Login successful");

  // ✅ Step 4: Prepare dynamic values
  const today = getNextBusinessDate();
  logger.info(`Next business date calculated as: ${today}`);

  data.tran_date = today;
  data.value_date = today;
  data.effective_date = today;

  data.account_filter = "BONY-1052334504";
  data.debit_acc = "1052334504";

  data.amount = Math.floor(Math.random() * 10000 + 100); // random amount

  // ✅ Step 5: Call Payment API
  const apiCall = new APIModule(api, logger);
  console.log("Token in wires.spec.ts:", token);
  const template = requestRow.request_file;
  const { response: paymentRes, body } = await apiCall.apiRequest(
    data,
    token,
    template,
  );

  // ✅ Step 6: Assertions
  expect(paymentRes.ok()).toBeTruthy();
  expect(body).toContain("Payment Submitted");
});
