/* eslint-disable @nx/enforce-module-boundaries */
import { ApplicationBootstrapOptions } from "apps/api/src/bootstrap";
/* eslint-enable @nx/enforce-module-boundaries */

export const testOptions: ApplicationBootstrapOptions = {
  port: 0, // OS picks free port for tests
  security: {
    expiresIn: '15m',
    refreshIn: '7d',
    bcryptSalt: '10',
    jwtAccessSecret: 'test-access',
    jwtRefreshSecret: 'test-refresh',
  },
  mail: { provider: 'resend', options: { apiKey: 'test' } },
  database: { host: 'localhost', port: 5432, database: 'test', user: 'u', password: 'p' },
};
