# Playwright Automation Framework

DB-driven Playwright + TypeScript framework supporting both **Web (UI)** and **API** tests against the Bottomline DGB platform. Environment configuration and credentials are loaded from PostgreSQL — tests never hardcode URLs or passwords.

---

## How it works

```
┌─────────────────────────────────────────────────────────────┐
│  globalSetup (runs once per `playwright test` invocation)   │
│  ─ reads env vars → frameworkConfig                         │
│  ─ queries Postgres for environment by EXECUTION_ID         │
│  ─ writes resolved ExecutionContext to .cache/              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Workers / Tests                                            │
│  Fixtures available in every spec:                          │
│   • executionContext  (worker-scoped, from cache)           │
│   • login.get(key)    (per-test, queries login table)       │
│   • testData.query(sql, params)  (per-test, raw SQL)        │
│   • apiClient.create(target)     (per-test, BaseApiClient)  │
│   • logger                                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Environment variables (set per run)

| Var            | Default                   | Notes                                     |
| -------------- | ------------------------- | ----------------------------------------- |
| `EXECUTION_ID` | `qa8`                     | Lookup key into `config_execution` table  |
| `TEST_TYPE`    | `api`                     | `api` or `web`                            |
| `APP`          | `client`                  | `client` or `admin` (web only)            |
| `RUN_MODE`     | `local`                   | `local` or `grid` (grid not yet wired)    |
| `LOGIN_ID`     | `config_login_regression` | Name of the Postgres table holding logins |
| `LOG_LEVEL`    | `info`                    | `debug` \| `info` \| `warn` \| `error`    |

Copy `.env.example` to `.env` (loading dotenv is not yet wired — set them in your shell or use the npm scripts).

---

## Quickstart

```pwsh
npm install
npx playwright install chromium

# API tests (default app=client)
npm run test:api

# Web client tests
npm run test:web:client

# Web admin tests
npm run test:web:admin

# Pick a specific spec
npx cross-env TEST_TYPE=web APP=client playwright test src/web/client/tests/login.spec.ts

# View the HTML report
npm run report
```

A successful run leaves a `.cache/execution-context.json` snapshot of the resolved environment (gitignored).

---

## Writing a test

```ts
import { test, expect } from "../../../core/fixtures/baseFixture";
import { LoginFlow } from "../flows/LoginFlow";

test("My web test", async ({
  page,
  executionContext,
  login,
  testData,
  logger,
}) => {
  // 1. Get credentials from the configured login table
  const creds = await login.get("regression_user_01");

  // 2. Pull domain test data with parameterized SQL
  const row = await testData.one<{ amount: string }>(
    "SELECT amount FROM testdata_payments WHERE test_key = $1",
    ["payment_smoke_001"],
  );

  // 3. Drive the UI
  await LoginFlow.login(page, {
    url: executionContext.environment.client_url,
    userGroup: creds.user_group,
    user: creds.user,
    password: creds.password,
  });

  expect(row.amount).toBeTruthy();
});
```

For an API test, use the `apiClient` fixture and `src/api/baseApiTest.ts`:

```ts
import { test, expect } from "../baseApiTest";

test("hits an api", async ({ apiClient, login }) => {
  const creds = await login.get("regression_user_01");
  const api = await apiClient.create("client");
  const res = await api.post("/some/endpoint", { user: creds.user });
  expect(res.ok()).toBeTruthy();
});
```

### Multi-app sequencing in one test (admin → client)

Because we don't reuse `storageState`, a single test can log in to admin, do work, log out, then log in to client on the same `Page`:

```ts
import { LoginPage } from "../pages/login/LoginPage";

const adminCreds = await login.get("admin_user_01");
const clientCreds = await login.get("regression_user_01");

await LoginFlow.login(page, {
  url: executionContext.environment.admin_url,
  ...adminToFlowShape(adminCreds),
});
// ... admin work ...
await new LoginPage(page).logout();

await LoginFlow.login(page, {
  url: executionContext.environment.client_url,
  ...adminToFlowShape(clientCreds),
});
// ... client work ...
```

---

## Project layout

```
config/framework.config.ts          # Env-driven config (EXECUTION_ID, TEST_TYPE, APP, ...)
playwright.config.ts                 # Wires globalSetup + globalTeardown, dynamic testDir
src/
  core/
    setup/globalSetup.ts             # Loads env from DB once → .cache/
    setup/globalTeardown.ts          # Closes pg pool
    context/ExecutionContext.ts      # Cache load/save + interface
    context/EnvironmentConfig.ts
    context/LoginCredentials.ts
    fixtures/baseFixture.ts          # executionContext, login, testData, apiClient, logger
    base/BasePage.ts                 # Shared Page Object base
    base/BaseApiClient.ts            # Wraps APIRequestContext, resolves URL from env
    logger/logger.ts                 # Leveled logger
  db/
    PostgresClient.ts                # Singleton pool + query/execute
    EnvironmentRepository.ts         # Loads EnvironmentConfig
    LoginRepository.ts               # getByKey(table, key) → LoginCredentials
    postgres.db.config.ts            # DB connection config (currently hardcoded)
  api/
    baseApiTest.ts                   # Re-exports framework `test` for API specs
    authenticationModule.ts          # Login API helper (uses BaseApiClient)
    requests/                        # JSON request templates with {{key}} substitution
    tests/                           # API specs
  web/
    client/{pages,flows,models,tests}/
    admin/{pages,flows,tests}/       # Scaffolding only
  utils/
    DropdownHelper.ts
    requestTemplateUtil.ts
.cache/                              # Generated on each run (gitignored)
```

---

## Conventions

1. **Never hardcode URLs or credentials in specs.** Use `executionContext.environment.*` and `login.get(key)`.
2. **Always parameterize SQL** in `testData.query(sql, params)` — placeholders `$1`, `$2`, ...
3. **Page Objects** extend `BasePage` (or stay framework-agnostic if there's a strong reason); selectors live in the page class.
4. **Flows** orchestrate page objects; tests call flows.
5. **API helpers** (like `AuthenticationModule`) take a `BaseApiClient` + `Logger` in their constructor — don't open `request.newContext` manually inside tests.

---

## Troubleshooting

| Symptom                                                           | Cause / Fix                                                                                                     |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `ExecutionContext cache not found at .cache/...`                  | You ran a test runner that bypasses Playwright's globalSetup. Run via `npx playwright test` or the npm scripts. |
| `No environment configuration found for execution_identifier=...` | `EXECUTION_ID` doesn't match a row in `config_execution`.                                                       |
| `No login row found in table='...' for identifier='...'`          | `LOGIN_ID` table or `key` passed to `login.get()` is wrong.                                                     |
| Process hangs at exit                                             | `globalTeardown` should close the pool; if you removed it, add it back in `playwright.config.ts`.               |

---

## Out of scope (future work)

- Move Postgres credentials from `src/db/postgres.db.config.ts` to env / secrets store.
- Real `dotenv` loading (`.env.example` is scaffolded).
- Admin web scaffolding (pages, flows, tests).
- Mobile testing.
- `runMode: 'grid'` wiring (Selenium Grid / Playwright service / cloud).
- CI pipeline.
