import { defineConfig } from 'drizzle-kit';
import { ConfigService } from '@nestjs/config';
import { CONFIG_APP } from '@goran/config';
import 'dotenv/config';

const configService = new ConfigService();

export default defineConfig({
    schema: './schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        host: configService.get(CONFIG_APP.DB_HOST),
        port: configService.get(CONFIG_APP.DB_PORT),
        user: configService.get(CONFIG_APP.DB_USER),
        password: configService.get(CONFIG_APP.DB_PASSWORD),
        database: configService.get(CONFIG_APP.DB_DATABASE),
    },
})
