import { pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { timestamps } from '../columns.helpers';

export const ProducersTable = pgTable('producers', {
    ...timestamps,
    id: text('id')
        .primaryKey()
        .$defaultFn(() => ulid()),
    fullname: text('fullname'),
    nickname: text('nickname'),
    bio: text('nickname'),
});
