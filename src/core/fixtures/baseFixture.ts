import { test as base, expect } from "@playwright/test";
import { QueryResultRow } from "pg";
import {
  ExecutionContext,
  loadExecutionContext,
} from "../context/ExecutionContext";
import { LoginCredentials } from "../context/LoginCredentials";
import { LoginRepository } from "../../db/LoginRepository";
import { PostgresClient } from "../../db/PostgresClient";
import { BaseApiClient, ApiTarget } from "../base/BaseApiClient";
import { createLogger, Logger } from "../logger/logger";

/**
 * Test-data fixture surface.
 *
 * IMPORTANT: this fixture executes raw SQL. ALWAYS use parameterized queries
 * (`$1`, `$2` placeholders + params array). Never interpolate user/test input
 * into the SQL string directly.
 */
export interface TestDataFixture {
  query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[],
  ): Promise<T[]>;
  one<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params?: unknown[],
  ): Promise<T>;
  value<T = unknown>(sql: string, params?: unknown[]): Promise<T>;
}

export interface LoginFixture {
  /** Fetch credentials by `identifier` from the table named in frameworkConfig.loginIdentifier. */
  get(key: string): Promise<LoginCredentials>;
}

export interface ApiClientFactory {
  /** Build a BaseApiClient bound to the current ExecutionContext. */
  create(
    target?: ApiTarget,
    extraHeaders?: Record<string, string>,
  ): Promise<BaseApiClient>;
}

type WorkerFixtures = {
  executionContext: ExecutionContext;
};

type TestFixtures = {
  logger: Logger;
  login: LoginFixture;
  testData: TestDataFixture;
  apiClient: ApiClientFactory;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // ── Worker-scoped: read once per worker from the on-disk cache ──────────
  executionContext: [
    async ({}, use) => {
      const ctx = loadExecutionContext();
      await use(ctx);
    },
    { scope: "worker" },
  ],

  // ── Test-scoped logger, tagged with the test title ──────────────────────
  logger: async ({}, use, testInfo) => {
    const log = createLogger(testInfo.title);
    await use(log);
  },

  // ── login.get(key) ──────────────────────────────────────────────────────
  login: async ({ executionContext, logger }, use) => {
    const repo = new LoginRepository();
    const cache = new Map<string, LoginCredentials>();
    const fixture: LoginFixture = {
      async get(key) {
        if (cache.has(key)) return cache.get(key)!;
        logger.debug(
          `login.get(key='${key}', table='${executionContext.loginIdentifier}')`,
        );
        const creds = await repo.getByKey(
          executionContext.loginIdentifier,
          key,
        );
        cache.set(key, creds);
        return creds;
      },
    };
    await use(fixture);
  },

  // ── testData.query(sql, params) ─────────────────────────────────────────
  testData: async ({ logger }, use) => {
    const db = new PostgresClient();
    const fixture: TestDataFixture = {
      async query(sql, params = []) {
        logger.debug(`testData.query`, { sql: sql.trim(), params });
        return db.query(sql, params as any[]);
      },
      async one(sql, params = []) {
        const rows = await db.query(sql, (params as any[]) ?? []);
        if (rows.length === 0) {
          throw new Error(`testData.one: no rows for sql=${sql}`);
        }
        return rows[0] as any;
      },
      async value(sql, params = []) {
        const rows = await db.query(sql, (params as any[]) ?? []);
        if (rows.length === 0) {
          throw new Error(`testData.value: no rows for sql=${sql}`);
        }
        const firstKey = Object.keys(rows[0])[0];
        return rows[0][firstKey] as any;
      },
    };
    await use(fixture);
  },

  // ── apiClient factory ───────────────────────────────────────────────────
  apiClient: async ({ executionContext, logger }, use) => {
    const created: BaseApiClient[] = [];
    const factory: ApiClientFactory = {
      async create(target = "client", extraHeaders) {
        const client = await BaseApiClient.create(
          executionContext,
          logger,
          target,
          extraHeaders,
        );
        created.push(client);
        return client;
      },
    };
    await use(factory);
    for (const client of created) await client.dispose();
  },
});

export { expect };
