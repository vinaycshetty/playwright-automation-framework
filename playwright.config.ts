/// <reference types="node" />
import { defineConfig, devices } from "@playwright/test";
import { frameworkConfig } from "./config/framework.config";
import * as fs from "fs";
import * as path from "path";

function resolveTestDir(): string {
  if (frameworkConfig.testType === "api") {
    return "src/api/tests";
  }

  return `src/web/${frameworkConfig.app}/tests`;
}

const testDir = resolveTestDir();

// ✅ Fail fast if config is wrong
if (!fs.existsSync(path.resolve(testDir))) {
  throw new Error(
    `Resolved testDir does not exist: ${testDir}
frameworkConfig = ${JSON.stringify(frameworkConfig, null, 2)}`,
  );
}

export default defineConfig({
  testDir,
  globalSetup: require.resolve("./src/core/setup/globalSetup"),
  globalTeardown: require.resolve("./src/core/setup/globalTeardown"),
  timeout: 200 * 1000,
  expect: {
    timeout: 10000,
  },
  reporter: [["html", { outputFolder: "reports/html" }]],
  fullyParallel: true,
  use: {
    headless: false,
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    viewport: null,
    launchOptions: {
      args: ["--start-maximized"],
    },
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
