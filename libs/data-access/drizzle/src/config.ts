import { defineConfig } from 'drizzle-kit';
import { CONFIG_APP } from '@goran/config';
import 'dotenv/config';

export default defineConfig({
    schema: './schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env[CONFIG_APP.DB_HOST],
        port: process.env[CONFIG_APP.DB_PORT],
        user: process.env[CONFIG_APP.DB_USER],
        password: process.env[CONFIG_APP.DB_PASSWORD],
        database: process.env[CONFIG_APP.DB_DATABASE],
    },
});
