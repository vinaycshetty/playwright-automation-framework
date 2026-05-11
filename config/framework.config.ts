export interface FrameworkConfig {
  executionId: string;
  testType: 'web' | 'api';
  app?: 'admin' | 'client';
  runMode: 'local' | 'grid';
  loginIdentifier: string;
}

export const frameworkConfig: FrameworkConfig = {
  executionId: process.env.EXECUTION_ID ?? 'qa8',
  testType: (process.env.TEST_TYPE as 'web' | 'api') ?? 'api',
  app: (process.env.APP as 'admin' | 'client') ?? 'client',
  runMode: (process.env.RUN_MODE as 'local' | 'grid') ?? 'local',
  loginIdentifier: process.env.LOGIN_ID ?? 'config_login_regression'
};
