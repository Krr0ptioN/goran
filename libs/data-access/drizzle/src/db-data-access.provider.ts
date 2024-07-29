import { drizzle as neonDrizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { drizzle as nodePostgresDrizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { CONFIG_APP } from '@goran/config';
import * as schema from './schema';

export const DbDataAccessProvider = 'DbDataAccessProvider';

export const dbDataAccessProvider = {
    provide: DbDataAccessProvider,
    useFactory: async () => {
        const url = process.env[CONFIG_APP.DRIZZLE_DATABASE_URL];
        const databaseInfra = process.env[CONFIG_APP.DATABASE_INFRASTRUCTURE];
        if (url) {
            if (databaseInfra === "NEON_POSTGRES") {
                const sql = neon(url);
                return neonDrizzle(sql, { schema });
            }
            else if (databaseInfra === "NODE_POSTGRES") {
                const sql = new Pool({ connectionString: url })
                return nodePostgresDrizzle(sql, { schema });
            } else {
                throw new Error('DATABASE_INFRASTRUCTURE env is not set');
            }
        } else {
            throw new Error('DRIZZLE_DATABASE_URL env is not set');
        }
    },
    exports: [DbDataAccessProvider],
};
