import {
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { UsersDataPgTable } from './users';

export const sessionStatusEnum = pgEnum('session_status', [
    'active',
    'revoked',
]);

export const SessionsDataPgTable = pgTable(
    'sessions',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => ulid()),
        userId: text('user_id')
            .references(() => UsersDataPgTable.id)
            .notNull(),
        status: sessionStatusEnum('status').notNull().default('active'),
        refreshToken: text('refresh_token').notNull().unique(),
        location: text('location'),
        device: text('device'),
        ip: text('ip').notNull(),
        expire: timestamp('expire').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (sessions) => {
        return {
            uniquerefreshToken: uniqueIndex('unique_refresh_token').on(
                sessions.refreshToken
            ),
        };
    }
);
