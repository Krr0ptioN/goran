import { pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from '../columns.helpers';
import { UsersTable } from '../users';

export const PlaylistsTable = pgTable('songs', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    userId: text('user_id')
        .notNull()
        .references(() => UsersTable.id),
    description: text('description'),
    name: text('name'),
});
