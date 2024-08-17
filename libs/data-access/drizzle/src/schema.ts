import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
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

const schema = {
  UsersDataPgTable
};

export default schema;
