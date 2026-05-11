import * as fs from "fs";
import * as path from "path";
import { EnvironmentConfig } from "./EnvironmentConfig";

export interface ExecutionContext {
  executionId: string;
  testType: "web" | "api";
  app?: "admin" | "client";
  runMode: "local" | "grid";
  loginIdentifier: string;
  environment: EnvironmentConfig;
}

/**
 * On-disk location where globalSetup writes the resolved ExecutionContext.
 * All workers/tests read from this cache so we do exactly ONE DB round-trip
 * per run for environment configuration.
 */
export const EXECUTION_CONTEXT_CACHE_PATH = path.resolve(
  ".cache/execution-context.json",
);

export function saveExecutionContext(ctx: ExecutionContext): void {
  const dir = path.dirname(EXECUTION_CONTEXT_CACHE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    EXECUTION_CONTEXT_CACHE_PATH,
    JSON.stringify(ctx, null, 2),
    "utf-8",
  );
}

export function loadExecutionContext(): ExecutionContext {
  if (!fs.existsSync(EXECUTION_CONTEXT_CACHE_PATH)) {
    throw new Error(
      `ExecutionContext cache not found at ${EXECUTION_CONTEXT_CACHE_PATH}. ` +
        `globalSetup did not run. Use \`npx playwright test\` (or the npm scripts) so globalSetup executes first.`,
    );
  }
  const raw = fs.readFileSync(EXECUTION_CONTEXT_CACHE_PATH, "utf-8");
  return JSON.parse(raw) as ExecutionContext;
}
