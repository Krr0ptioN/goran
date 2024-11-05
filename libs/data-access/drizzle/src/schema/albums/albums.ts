import { date, pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from '../columns.helpers';
import { ProducersTable } from '../producers/producers';

export const AlbumsTable = pgTable('albums', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    name: text('name'),
    releasedDate: date('released_date'),
    producerId: text('producer_id')
        .notNull()
        .references(() => ProducersTable.id),
});
