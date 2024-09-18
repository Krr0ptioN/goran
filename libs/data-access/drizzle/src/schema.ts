import {
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    pgEnum,
    date,
} from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const UsersDataPgTable = pgTable(
    'users',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => ulid()),
        fullname: text('fullname'),
        username: text('name').notNull().unique(),
        password: text('password').notNull(),
        email: text('email').notNull().unique(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (users) => {
        return {
            uniqueIdx: uniqueIndex('unique_idx').on(users.email),
        };
    }
);

export const passwordResetStatusEnum = pgEnum('password_reset_status', [
    'requested',
    'verified',
    'successful',
    'dismissed',
]);

export const PasswordResetRequestsDataPgTable = pgTable(
    'password_reset_requests',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => ulid()),
        userId: text('user_id')
            .references(() => UsersDataPgTable.id)
            .notNull(),
        status: passwordResetStatusEnum('status')
            .notNull()
            .default('requested'),
        token: text('token').notNull().unique(),
        otpcode: text('otpcode').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    }
);

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
            uniqueUserIdx: uniqueIndex('unique_user_idx').on(sessions.userId),
        };
    }
);

const schema = {
    UsersDataPgTable,
    PasswordResetRequestsDataPgTable,
    passwordResetStatusEnum,
    sessionStatusEnum,
    SessionsDataPgTable,
};

export default schema;
