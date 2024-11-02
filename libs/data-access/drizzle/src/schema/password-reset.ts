import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { UsersDataPgTable } from './users';

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
