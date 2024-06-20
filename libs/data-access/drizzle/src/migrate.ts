import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as path from 'path';

const sql = neon(
  process.env['DRIZZLE_DATABASE_URL']
    ? process.env['DRIZZLE_DATABASE_URL']
    : 'postgresql://goran-db_owner:BPVG8SUZ4zRq@ep-bold-king-a2kvdx7z.eu-central-1.aws.neon.tech/goran-db?sslmode=require'
);

const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: path.join(__dirname, '.', 'drizzle/'),
    });
    console.log('Migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

main();
