import { primaryKey, pgTable, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';
import { ProducersTable } from './producers';
import { SongsTable } from '../songs/songs';

export const ProducersSongsTable = pgTable(
    'producers',
    {
        ...timestamps,
        producerId: text('producer_id')
            .notNull()
            .references(() => ProducersTable.id),
        songId: text('song_id')
            .notNull()
            .references(() => SongsTable.id),
    },
    (columns) => ({
        pk: primaryKey({ columns: [columns.producerId, columns.songId] }),
    })
);
