import {
  pgTable,
  uuid,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const UsersDataPgTable = pgTable(
  'users',
  {
    id: uuid('id').primaryKey(),
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
