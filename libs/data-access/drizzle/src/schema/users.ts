import { pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { timestamps } from './columns.helpers';
import { ulid } from 'ulid';

export const UsersTable = pgTable(
    'users',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => ulid()),
        fullname: text('fullname'),
        username: text('name').notNull().unique(),
        password: text('password').notNull(),
        email: text('email').notNull().unique(),
        ...timestamps,
    },
    (users) => {
        return {
            uniqueIdx: uniqueIndex('unique_idx').on(users.email),
        };
    }
);
