import { FullConfig } from "@playwright/test";
import { frameworkConfig } from "../../../config/framework.config";
import { EnvironmentRepository } from "../../db/EnvironmentRepository";
import {
  ExecutionContext,
  saveExecutionContext,
  EXECUTION_CONTEXT_CACHE_PATH,
} from "../context/ExecutionContext";
import { closePostgresPool } from "../../db/PostgresClient";

/**
 * Runs once per `playwright test` invocation, before any worker starts.
 *
 *  1. Reads `frameworkConfig` (env-var driven).
 *  2. Loads the matching environment row from Postgres.
 *  3. Writes the resolved ExecutionContext to disk so every worker/test
 *     can read it without hitting the DB again.
 *  4. Closes the pool — the workers will open their own pools lazily
 *     (only when a test actually uses the `login` or `testData` fixture).
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  console.log("[globalSetup] Resolving environment for", {
    executionId: frameworkConfig.executionId,
    testType: frameworkConfig.testType,
    app: frameworkConfig.app,
    loginIdentifier: frameworkConfig.loginIdentifier,
  });

  const envRepo = new EnvironmentRepository();
  const environment = await envRepo.getEnvironmentConfig(
    frameworkConfig.executionId,
  );

  const ctx: ExecutionContext = {
    executionId: frameworkConfig.executionId,
    testType: frameworkConfig.testType,
    app: frameworkConfig.app,
    runMode: frameworkConfig.runMode,
    loginIdentifier: frameworkConfig.loginIdentifier,
    environment,
  };

  saveExecutionContext(ctx);

  console.log("[globalSetup] Resolved environment:", {
    environment: environment.environment_identifier,
    client_url: environment.client_url,
    admin_url: environment.admin_url,
    cachePath: EXECUTION_CONTEXT_CACHE_PATH,
  });

  // Release the setup-process pool; workers will create their own.
  await closePostgresPool();
}

export default globalSetup;
