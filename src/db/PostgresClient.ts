import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";
import { postgresConfig } from "./postgres.db.config";

/**
 * Singleton pg Pool for the entire process.
 *
 * Why a singleton:
 *  - Playwright spawns multiple workers, but each worker is its own Node process,
 *    so one pool per process is correct.
 *  - Avoids exhausting the DB with new pools on every repository instantiation.
 */
let pool: Pool | undefined;

export function getPostgresPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: postgresConfig.host,
      port: postgresConfig.port,
      user: postgresConfig.user,
      password: postgresConfig.password,
      database: postgresConfig.database,
      options: `-c search_path=${postgresConfig.schema}`,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    pool.on("error", (err) => {
      // Surface idle-client errors so we don't lose them silently.
      console.error("[PostgresClient] idle client error:", err);
    });
  }
  return pool;
}

export async function closePostgresPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

export class PostgresClient {
  private pool: Pool;

  constructor() {
    this.pool = getPostgresPool();
  }

  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: any[] = [],
  ): Promise<T[]> {
    let client: PoolClient | undefined;

    try {
      client = await this.pool.connect();
      const result: QueryResult<T> = await client.query(sql, params);
      return result.rows;
    } finally {
      client?.release();
    }
  }

  async execute(sql: string, params: any[] = []): Promise<number> {
    let client: PoolClient | undefined;

    try {
      client = await this.pool.connect();
      const result = await client.query(sql, params);
      return result.rowCount ?? 0;
    } finally {
      client?.release();
    }
  }
}
