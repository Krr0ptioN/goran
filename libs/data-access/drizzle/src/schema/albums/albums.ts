import { date, pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from '../columns.helpers';

export const AlbumsTable = pgTable('albums', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    name: text('name'),
    releasedDate: date('released_date'),
});
