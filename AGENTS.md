# Playwright Automation Framework — Agent Instructions

DB-driven Playwright + TypeScript framework for the Bottomline DGB platform.
All environment config and credentials are loaded from **PostgreSQL** — never hardcode URLs, usernames, or passwords.

See [README.md](README.md) for the full architecture diagram and quickstart.

---

## Build & Test Commands

```pwsh
npm install
npx playwright install chromium

npm run test:api                  # API tests (default)
npm run test:web:client           # Web client tests
npm run test:web:admin            # Web admin tests
npm run test:headed               # Run with browser visible
npm run test:debug                # Run in Playwright debug mode
npm run report                    # Open HTML report at reports/html
```

Run a single spec:

```pwsh
npx cross-env TEST_TYPE=web APP=client playwright test src/web/client/tests/payments/CashConcentration.spec.ts
```

---

## Environment Variables

| Var                   | Default                   | Notes                                               |
| --------------------- | ------------------------- | --------------------------------------------------- |
| `EXECUTION_ID`        | `dev2`                    | Lookup key into `config_execution` Postgres table   |
| `TEST_TYPE`           | `api`                     | `api` or `web`                                      |
| `APP`                 | `client`                  | `client` or `admin` (web only)                      |
| `RUN_MODE`            | `local`                   | `local` or `grid`                                   |
| `LOGIN_ID`            | `config_login_regression` | Name of Postgres table holding login rows           |
| `LOG_LEVEL`           | `info`                    | `debug` \| `info` \| `warn` \| `error`              |
| `feeder1` … `feederN` | —                         | Override login keys; `default` keeps the identifier |

---

## Project Layout

```
config/framework.config.ts        # Reads env vars → FrameworkConfig
src/core/
  setup/globalSetup.ts            # Runs once: resolves ExecutionContext → .cache/
  fixtures/baseFixture.ts         # All custom fixtures (executionContext, login, testData, apiClient, logger)
  base/BasePage.ts                # Base class for all page objects
  base/BaseApiClient.ts           # HTTP client wrapper (resolves URLs from ExecutionContext)
  context/ExecutionContext.ts     # Interface + cache helpers (.cache/execution-context.json)
  context/EnvironmentConfig.ts    # Postgres environment row shape
src/db/
  PostgresClient.ts               # pg pool wrapper
  EnvironmentRepository.ts        # Queries config_execution + config_environments
  LoginRepository.ts              # Queries configurable login table
src/api/
  baseApiTest.ts                  # Re-exports test/expect for API specs — import from here
  modules/authenticationModule.ts # Login via banking-services endpoint
  modules/apiModule.ts            # Payment API calls (older module, uses ${key} templates)
  requests/                       # JSON request templates using {{key}} placeholders
  tests/                          # API spec files
src/web/{client|admin}/
  pages/                          # Page objects extending BasePage
  flows/                          # Static flow helpers (LoginFlow, NavigationFlow, etc.)
  tests/                          # Web spec files
src/utils/
  feederHelper.ts                 # getFeeder(identifier, n) — supports env-var login key overrides
  requestTemplateUtil.ts          # transformRequest(template, data) — {{key}} placeholder replacement
  dateHelper.ts                   # getNextBusinessDate() and related helpers
```

---

## Key Conventions

### Test Imports

- **API specs**: `import { test, expect } from '../baseApiTest';`
- **Web specs**: `import { test, expect } from '../../../../core/fixtures/baseFixture';`
- Never import from `@playwright/test` directly in spec files.

### Fixtures Available in Every Test

```ts
test('...', async ({ page, executionContext, login, testData, apiClient, logger }) => { ... });
```

- `executionContext` — worker-scoped, resolved by globalSetup.
- `login.get(key)` — fetches `LoginCredentials` from the configured login table.
- `testData.one(sql, params)` / `.query(sql, params)` / `.value(sql, params)` — raw parameterized SQL.
- `apiClient.create(target?, extraHeaders?)` — returns a `BaseApiClient`; targets: `client | admin | hub | clientStrict | tyk`.
- `logger` — structured logger scoped to the test title.

### Always Use Parameterized SQL

```ts
// ✅ Correct
await testData.one("SELECT * FROM btschema.test_data WHERE id = $1", ["my_id"]);

// ❌ Never interpolate
await testData.one(`SELECT * FROM btschema.test_data WHERE id = '${id}'`);
```

### Page Objects

- Extend `BasePage` (`src/core/base/BasePage.ts`).
- Constructor signature: `(page: Page, ctx: ExecutionContext, logger: Logger)`.
- Use `this.baseUrl()` and `this.gotoPath(relativePath)` — never hardcode URLs.
- Use `this.safeClick(locator)` for clicks that need visibility waits.

### Flows

- Static classes in `src/web/{app}/flows/`.
- Orchestrate multiple page objects. Tests call flows, not pages directly.
- `LoginFlow.login(page, { url, userGroup, user, password })` — standard login entry point.

### API Modules

- Use `AuthenticationModule` with `BaseApiClient` for authentication.
- Request templates live in `src/api/requests/` as JSON with `{{key}}` placeholders.
- `transformRequest(template, data)` from `src/utils/requestTemplateUtil.ts` substitutes `{{key}}` placeholders.
- `APIModule` (older) uses `${key}` placeholders in its `transformReqBody` method — note the different syntax.

### feederHelper

```ts
import { getFeeder } from "../../../../utils/feederHelper";
// Returns env var feeder1 if set, otherwise falls back to 'myLoginKey'
const creds = await login.get(getFeeder("myLoginKey", 1));
```

---

## Common Pitfalls

- **`ExecutionContext` cache missing**: If you see `ExecutionContext cache not found`, run via `npm run test:…` or `npx playwright test` — do not invoke spec files directly with `ts-node`.
- **Wrong `testDir`**: The resolved test directory is `src/api/tests` or `src/web/{app}/tests`. Specs outside that directory won't be discovered.
- **`test.only` left in code**: `wires.spec.ts` and `CashConcentration.spec.ts` currently have `test.only` — remove before committing to run the full suite.
- **`console.log` token exposure**: `wires.spec.ts` logs tokens to console — avoid in production runs.
- **Template placeholder mismatch**: `AuthenticationModule`/`requestTemplateUtil` use `{{key}}`; the older `APIModule.transformReqBody` uses `${key}`. Match the right template syntax to the right module.
