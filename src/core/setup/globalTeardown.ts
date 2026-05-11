import { closePostgresPool } from "../../db/PostgresClient";

/**
 * Runs once per `playwright test` invocation, after all workers finish.
 * Closes the pg pool so the process exits cleanly with no open handles.
 */
async function globalTeardown(): Promise<void> {
  await closePostgresPool();
}

export default globalTeardown;
