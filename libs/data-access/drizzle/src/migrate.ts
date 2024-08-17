import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as path from 'path';
import { Pool } from 'pg';
import schema from './schema';

const pool = new Pool({
    host: process.env["DB_HOST"],
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    port: Number(process.env["DB_PORT"]),
    database: process.env["DB_DATABASE"],
});

const db = drizzle(pool, { schema });

const main = async () => {
    try {
        await migrate(db, {
            migrationsFolder: path.join(__dirname, '.', 'drizzle/'),
        });
        await pool.end();
        console.log('Migration completed');
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
};

main();
