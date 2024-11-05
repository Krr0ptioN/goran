import { pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from '../columns.helpers';

export const GenresTable = pgTable('genres', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    name: text('name').notNull(),
});
