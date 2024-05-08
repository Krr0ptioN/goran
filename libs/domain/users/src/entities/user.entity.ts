import { UsersDataPgTable } from '@goran/db-data-access';

export type UserEntity = typeof UsersDataPgTable.$inferSelect;
export type UserEntityInfo = Pick<
  UserEntity,
  'id' | 'email' | 'fullname' | 'username' | 'createdAt' | 'updatedAt'
>;

export type UserEntityInfoQuery = Pick<
  Partial<UserEntity>,
  'id' | 'email' | 'fullname' | 'username'
>;

export type UserEntityMutation = Pick<
  UserEntity,
  'email' | 'fullname' | 'username' | 'password'
>;
