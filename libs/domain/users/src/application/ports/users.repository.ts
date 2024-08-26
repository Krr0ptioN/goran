import {
    PaginatedQueryParams,
    ReadModelRepositoryPort,
    WriteModelRepositoryPort,
} from '@goran/common';
import { Option } from 'oxide.ts';
import { UserModel } from '../models';
import { UserEntity } from '../../domain/entities';

// TODO: Simplifying repository by only providing save and delete methods for write.
export interface FindUsersParams extends PaginatedQueryParams {
    readonly username?: string;
    readonly email?: string;
    readonly id?: string;
}

export interface WriteModelUsersRepository
    extends WriteModelRepositoryPort<UserEntity> {
    updateUsername(
        user: UserEntity,
        username: string
    ): Promise<Option<UserEntity>>;
    updateEmail(user: UserEntity, email: string): Promise<Option<UserEntity>>;
    updatePassword(
        user: UserEntity,
        password: string
    ): Promise<Option<UserEntity>>;
}

export interface ReadModelUsersRepository
    extends ReadModelRepositoryPort<UserModel> {
    findOneByEmail(email: string): Promise<Option<UserModel>>;
    findOneByUsername(username: string): Promise<Option<UserModel>>;
}

export interface UsersRepository
    extends WriteModelUsersRepository,
    ReadModelUsersRepository { }

export const UsersRepositoryProvider = Symbol('UsersRepository');
