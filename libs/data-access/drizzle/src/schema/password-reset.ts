import { pgTable, text, pgEnum } from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helpers';
import { ulid } from 'ulid';
import { UsersTable } from './users';

export const passwordResetStatusEnum = pgEnum('password_reset_status', [
    'requested',
    'verified',
    'successful',
    'dismissed',
]);

export const PasswordResetRequestsTable = pgTable('password_reset_requests', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    userId: text('user_id')
        .references(() => UsersTable.id)
        .notNull(),
    status: passwordResetStatusEnum('status').notNull().default('requested'),
    token: text('token').notNull().unique(),
    otpcode: text('otpcode').notNull(),
    ...timestamps,
});
