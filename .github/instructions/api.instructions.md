---
applyTo: "src/api/**"
---

# API Test Conventions

## Imports

```ts
import { test, expect } from "../baseApiTest";
import { AuthenticationModule } from "../modules/authenticationModule";
import { APIModule } from "../modules/apiModule";
```

- Always import `test`/`expect` from `../baseApiTest` — never from `@playwright/test`.
- Spec files belong in `src/api/tests/`.

## Standard Test Shape

Every API spec follows these steps in order:

```ts
test("test_id", async ({ apiClient, login, testData, logger }) => {
  // 1. Test data from Postgres — always parameterized
  const data = await testData.one(
    "SELECT * FROM btschema.test_data_api_payment WHERE test_data_id = $1",
    ["my_test_id"],
  );

  // 2. Credentials from DB — never hardcode
  const creds = await login.get("api1");
  Object.assign(data, creds); // merge creds into data for template substitution

  // 3. Create API client and authenticate
  const api = await apiClient.create("client");
  const auth = new AuthenticationModule(api, logger);
  const { response: loginRes, token } = await auth.authenticate({
    userGroup: data.user_group,
    userId: data.user, // note: AuthenticationModule expects 'userId', not 'user'
    password: data.password,
  });
  expect(loginRes.ok()).toBeTruthy();

  // 4. Prepare dynamic values (dates, amounts, etc.)
  data.tran_date = getNextBusinessDate();

  // 5. Call the API — fetch request template from DB or requests/
  const requestRow = await testData.one(
    "SELECT request_file FROM btschema.test_data_api_request WHERE request_file_id = $1",
    [data.add_payment_request_id],
  );
  const apiCall = new APIModule(api, logger);
  const { response, body } = await apiCall.apiRequest(
    data,
    token,
    requestRow.request_file,
  );

  // 6. Assert
  expect(response.ok()).toBeTruthy();
  expect(body).toContain("Payment Submitted");
});
```

## Fixture Types

Destructure fixtures with explicit types — do not use `: any`:

```ts
// ✅ Correct
test("...", async ({ apiClient, login, testData, logger }) => { ... });

// ❌ Avoid
test("...", async ({ apiClient, login, testData, logger }: any) => { ... });
```

## Authentication

`AuthenticationModule.authenticate()` expects this shape — note `userId`, not `user`:

```ts
await auth.authenticate({
  userGroup: creds.user_group,
  userId: creds.user, // ← field rename required
  password: creds.password,
});
```

The module reads `src/api/requests/client-login.json` by default and substitutes `{{key}}` placeholders via `transformRequest`.

## Request Templates

- JSON templates live in `src/api/requests/` and use `{{key}}` placeholders.
- `AuthenticationModule` / `requestTemplateUtil.transformRequest` — uses `{{key}}` syntax.
- `APIModule.transformReqBody` — uses `${key}` syntax (older pattern; request template stored in DB).

Do not mix the two syntaxes in the same template.

## SQL Rules

Always use parameterized queries. Never interpolate values into SQL strings:

```ts
// ✅ Correct
await testData.one("SELECT * FROM btschema.t WHERE id = $1", ["my_id"]);

// ❌ Never
await testData.one(`SELECT * FROM btschema.t WHERE id = '${id}'`);
```

## Common Pitfalls

| Pitfall                       | Rule                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| `console.log(token)`          | Remove before committing — tokens must not appear in logs    |
| `test.only(...)` left in file | Remove before committing — it silently skips all other tests |
| Hardcoded URLs / credentials  | Use `executionContext.environment.*` and `login.get(key)`    |
| Unparameterized SQL           | Always use `$1`, `$2` placeholders + params array            |
| Wrong template syntax         | `AuthenticationModule` → `{{key}}`; `APIModule` → `${key}`   |

## Adding a New API Module

Place reusable API call logic in `src/api/modules/`. Follow `AuthenticationModule` as the reference pattern:

- Accept a `BaseApiClient` and `Logger` in the constructor.
- Load JSON templates from `src/api/requests/` using `fs.readFileSync`.
- Use `transformRequest(template, data)` from `src/utils/requestTemplateUtil.ts`.
