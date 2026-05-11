/**
 * Re-exports the framework's extended `test` and `expect` for API specs.
 *
 * Usage:
 *   import { test, expect } from '../baseApiTest';
 *   test('...', async ({ apiClient, login, testData, executionContext }) => { ... });
 */
export { test, expect } from "../core/fixtures/baseFixture";
