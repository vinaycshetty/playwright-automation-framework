import { test, expect } from "../../../../core/fixtures/baseFixture";
import { LoginFlow } from "../../flows/LoginFlow";
import { WiresFromTemplateFlow } from "../../flows/WiresFromTemplateFlow";
import { getFeeder } from "../../../../utils/feederHelper";

test.describe('Wires from Template import', () => {
  test("E2E skeleton: import sample file (skeleton)", async ({ page, executionContext, login, logger }) => {
    const creds = await login.get(getFeeder('feeder1', 1));

    await LoginFlow.login(page, {
      url: executionContext.environment.client_url,
      userGroup: creds.user_group,
      user: creds.user,
      password: creds.password,
    });

    // NOTE: Replace with a real sample file path available to the test runner.
    const sampleFile = 'test-data/wires-from-template-sample.csv';

    // Run the import flow (this is a skeleton — assertions should be added once
    // the test-data and success indicators are known)
    const res = await WiresFromTemplateFlow.importFromTemplate(page, sampleFile, {
      mapName: 'Wires from Template',
      templateCode: 'DRAWDOWN-EXAMPLE',
      testMode: true,
    });

    expect(res.status).toBe('imported');
  });
});
