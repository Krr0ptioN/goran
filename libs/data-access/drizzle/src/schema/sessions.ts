import {
    timestamp,
    pgTable,
    text,
    uniqueIndex,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from './columns.helpers';
import { UsersTable } from './users';

export const sessionStatusEnum = pgEnum('session_status', [
    'active',
    'revoked',
]);

export const SessionsTable = pgTable(
    'sessions',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => ulid()),
        status: sessionStatusEnum('status').notNull().default('active'),
        refreshToken: text('refresh_token').notNull().unique(),
        location: text('location'),
        device: text('device'),
        ip: text('ip').notNull(),
        expire: timestamp('expire').notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => UsersTable.id),
        ...timestamps,
    },
    (sessions) => {
        return {
            uniquerefreshToken: uniqueIndex('unique_refresh_token').on(
                sessions.refreshToken
            ),
        };
    }
);
