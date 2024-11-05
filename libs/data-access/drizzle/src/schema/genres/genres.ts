import { pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from '../columns.helpers';
import { UsersTable } from '../users';

export const GenresTable = pgTable('genres', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    ownerId: text('owner_id')
        .notNull()
        .references(() => UsersTable.id),
    name: text('name').notNull(),
});
