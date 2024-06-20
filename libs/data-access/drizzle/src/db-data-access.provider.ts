import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { CONFIG_APP } from '@goran/config';
import * as schema from './schema';

export const DbDataAccessProvider = 'DbDataAccessProvider';

export const dbDataAccessProvider = {
  provide: DbDataAccessProvider,
  useFactory: async () => {
    const url = process.env[CONFIG_APP.DRIZZLE_DATABASE_URL];
    if (url) {
      const sql = neon(url);
      return drizzle(sql, { schema });
    } else {
      throw new Error('DRIZZLE_DATABASE_URL env is not set');
    }
  },
  exports: [DbDataAccessProvider],
};
