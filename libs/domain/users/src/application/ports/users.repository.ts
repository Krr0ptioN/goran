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

export abstract class WriteModelUsersRepository extends WriteModelRepositoryPort<UserEntity> {
    abstract updateUsername(
        user: UserEntity,
        username: string
    ): Promise<Option<UserEntity>>;
    abstract updateEmail(
        user: UserEntity,
        email: string
    ): Promise<Option<UserEntity>>;
    abstract updatePassword(
        user: UserEntity,
        password: string
    ): Promise<Option<UserEntity>>;
}

export abstract class ReadModelUsersRepository extends ReadModelRepositoryPort<UserModel> {
    abstract findOneByEmail(email: string): Promise<Option<UserModel>>;
    abstract findOneByUsername(username: string): Promise<Option<UserModel>>;
}
