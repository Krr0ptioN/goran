import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const CONFIG_APP = {
    DB_HOST: 'DB_HOST',
    DB_PORT: 'DB_PORT',
    DB_USER: 'DB_USER',
    DB_PASS: 'DB_PASS',
    DB_PWD: 'DB_PWD',
    DB_DATABASE: 'DB_DATABASE',
} as const;

export default defineConfig({
    schema: './libs/data-access/drizzle/src/schema/index.ts',
    out: './libs/data-access/drizzle/src/drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env[CONFIG_APP.DB_HOST] ?? 'localhost',
        port: Number.parseInt(process.env[CONFIG_APP.DB_PORT] ?? '5432', 10),
        user: process.env[CONFIG_APP.DB_USER],
        password:
            process.env[CONFIG_APP.DB_PASS] ??
            process.env[CONFIG_APP.DB_PWD] ??
            process.env[CONFIG_APP.DB_USER],
        database: process.env[CONFIG_APP.DB_DATABASE] ?? 'goran',
    },
});
