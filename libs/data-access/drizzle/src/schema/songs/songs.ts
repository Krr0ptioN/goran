import { pgTable, integer, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { UsersTable } from '../users';
import { timestamps } from '../columns.helpers';

export const SongsTable = pgTable('songs', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    userId: text('user_id')
        .references(() => UsersTable.id)
        .notNull(),
    mediaId: text('media_id').notNull(),
    title: text('title').notNull(),
    duration: integer('duration').notNull(),
});
