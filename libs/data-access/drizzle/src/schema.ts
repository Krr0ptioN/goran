import {
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    pgEnum,
} from 'drizzle-orm/pg-core';
import { ulid } from "ulid";

export const UsersDataPgTable = pgTable(
    'users',
    {
        id: text('id').primaryKey().$defaultFn(() => ulid()),
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

export const passwordResetStatusEnum = pgEnum('password_reset_status', ['requested', 'verified', 'successful', 'dismissed'])

export const PasswordResetRequestsDataPgTable = pgTable(
    'password_reset_requests',
    {
        id: text('id').primaryKey().$defaultFn(() => ulid()),
        userId: text('user_id').references(() => UsersDataPgTable.id).notNull(),
        status: passwordResetStatusEnum('status').notNull().default('requested'),
        token: text('token').notNull().unique(),
        otpcode: text('otpcode').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
);

const schema = {
    UsersDataPgTable,
    PasswordResetRequestsDataPgTable,
    passwordResetStatusEnum,
};

export default schema;
