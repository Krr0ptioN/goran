import { pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from '../columns.helpers';
import { UsersTable } from '../users';

export const PlaylistsTable = pgTable('playlists', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    ownerId: text('owner_id')
        .notNull()
        .references(() => UsersTable.id),
    description: text('description'),
    coverImageKey: text('cover_image_key'),
    name: text('name'),
});
