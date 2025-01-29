import { date, pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from '../columns.helpers';

export const AlbumsTable = pgTable('albums', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    name: text('name'),
    coverImageKey: text('cover_image_key'),
    releasedDate: date('released_date'),
});
