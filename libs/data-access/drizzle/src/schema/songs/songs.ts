import { pgTable, date, integer, text } from 'drizzle-orm/pg-core';
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
    audioFileKey: text('audio_file_key'),
    coverImageKey: text('cover_image_key'),
    title: text('title').notNull(),
    releasedDate: date('released_date'),
    duration: integer('duration').notNull(),
});
