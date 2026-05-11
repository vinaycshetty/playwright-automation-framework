import { PostgresClient } from "./PostgresClient";
import { LoginCredentials } from "../core/context/LoginCredentials";

/**
 * LoginRepository
 *
 * Reads login credentials from a configurable login table.
 *
 * The table name is provided by `frameworkConfig.loginIdentifier` (e.g.
 * "config_login_regression"). Each row is looked up by an `identifier` column.
 *
 * NOTE: Table name comes from configuration (not user input). It is interpolated
 * into the SQL string after a strict whitelist regex check, because Postgres
 * does not allow parameter placeholders for identifiers.
 */
export class LoginRepository {
  private db = new PostgresClient();

  async getByKey(tableName: string, key: string): Promise<LoginCredentials> {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(tableName)) {
      throw new Error(`Invalid login table name: ${tableName}`);
    }

    const sql = `
      SELECT *
      FROM ${tableName}
      WHERE identifier = $1
    `;

    const rows = await this.db.query(sql, [key]);

    if (!rows || rows.length === 0) {
      throw new Error(
        `No login row found in table='${tableName}' for identifier='${key}'`,
      );
    }

    const row = rows[0];

    return row as LoginCredentials;
  }
}
