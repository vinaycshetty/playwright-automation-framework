export interface EnvironmentConfig {
    environment_identifier: string; 
    client_url: string;
    admin_url: string;
    api_client_base_uri: string;
    api_admin_base_uri: string;
    api_hub_base_uri: string;
    deeplink_url: string;
    oracle_hostname: string;
    oracle_port: number;
    oracle_sid: string;
    oracle_web_schema: string;
    oracle_admin_schema: string;
    oracle_username: string;
    oracle_password: string;
    hub_hostname: string;
    hub_port: number;
    hub_username: string;
    hub_password: string;
    api_client_strict_uri: string;
    tyk_api_strict_uri: string;
}
