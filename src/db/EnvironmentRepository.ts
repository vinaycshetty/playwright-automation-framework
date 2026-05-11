import { PostgresClient } from './PostgresClient';
import { EnvironmentConfig } from '../core/context/EnvironmentConfig';

export class EnvironmentRepository {
  private db = new PostgresClient();

  async getEnvironmentConfig(executionId: string): Promise<EnvironmentConfig> {
    const sql = `
      SELECT
        ce.execution_identifier,
        ce.environment_identifier,
        env.client_url,
        env.admin_url,
        env.api_client_base_uri,
        env.api_admin_base_uri,
        env.api_hub_base_uri,
        env.deeplink_url,
        env.oracle_hostname,
        env.oracle_port,
        env.oracle_web_schema,
        env.oracle_admin_schema,
        env.oracle_username,
        env.oracle_password,
        env.oracle_sid,
        env.hub_hostname,
        env.hub_port,
        env.hub_username,
        env.hub_password,
        env.api_client_strict_uri,
        env.tyk_api_strict_uri
      FROM config_execution ce
      JOIN config_environments env
        ON ce.environment_identifier = env.environment_identifier
      WHERE ce.execution_identifier = $1
    `;

    const rows = await this.db.query(sql, [executionId]);

    if (!rows || rows.length === 0) {
      throw new Error(
        `No environment configuration found for execution_identifier=${executionId}`
      );
    }

    const row = rows[0];

    return {
      environment_identifier: row.environment_identifier,
      client_url: row.client_url,
      admin_url: row.admin_url,
      api_client_base_uri: row.api_client_base_uri,
      api_admin_base_uri: row.api_admin_base_uri,
      api_hub_base_uri: row.api_hub_base_uri,
      deeplink_url: row.deeplink_url,
      oracle_hostname: row.oracle_hostname,
      oracle_port: row.oracle_port,
      oracle_web_schema: row.oracle_web_schema,
      oracle_admin_schema: row.oracle_admin_schema,
      oracle_username: row.oracle_username,
      oracle_password: row.oracle_password,
      oracle_sid: row.oracle_sid,
      hub_hostname: row.hub_hostname,
      hub_port: row.hub_port,
      hub_username: row.hub_username,
      hub_password: row.hub_password,
      api_client_strict_uri: row.api_client_strict_uri,
      tyk_api_strict_uri: row.tyk_api_strict_uri
    };
  }
}