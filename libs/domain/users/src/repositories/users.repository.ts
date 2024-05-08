import { UserEntity, UserEntityInfo, UserEntityMutation } from '../entities';
import { ResourceRepository } from '@goran/types';

export type UsersRepository = ResourceRepository<
  UserEntity,
  UserEntityMutation,
  UserEntityInfo
>;
export const USERS_REPOSITORY = 'USERS_REPOSITORY';
