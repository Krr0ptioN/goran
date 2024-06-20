import {
    DbDataAccessProvider,
    UsersDataPgTable,
} from '@goran/drizzle-data-access';
import { Inject, Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import {
    UserAlreadyExistsError,
    UserNotFoundError,
    UsersRepository,
    UserEntity,
    UserMapper,
    UserModel,
} from '@goran/users';
import { Some, None, Option, Ok, Err } from 'oxide.ts';
import { Paginated, PaginatedQueryParams } from '@goran/common';

@Injectable()
export class NeonDrizzleUsersRepository implements Partial<UsersRepository> {
    constructor(
        @Inject(DbDataAccessProvider) readonly db: NeonHttpDatabase,
        private readonly mapper: UserMapper
    ) { }

    async findAllPaginated(params: PaginatedQueryParams) {
        const records = await this.db
            .select()
            .from(UsersDataPgTable)
            .limit(params.limit)
            .offset(params.offset);

        return new Paginated({
            data: records,
            count: records.length,
            limit: params.limit,
            page: params.page,
        });
    }

    async findOneById(userId: string): Promise<Option<UserModel>> {
        return await this.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.id, userId))
            .then((result) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async findOneByEmail(email: string): Promise<Option<UserModel>> {
        return await this.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.email, email))
            .then((result) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async findOneByUsername(username: string): Promise<Option<UserModel>> {
        return await this.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.username, username))
            .then((result) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async insertOne(user: UserEntity) {
        const userFound = await this.findOneById(user.id);
        if (userFound.isSome()) {
            return this.db
                .insert(UsersDataPgTable)
                .values(this.mapper.toPersistence(user))
                .then((result) => Ok(this.mapper.toDomain(result)))
                .catch((err) => Err(err));
        } else {
            return Err(UserAlreadyExistsError);
        }
    }

    async updateEmail(
        user: UserEntity,
        email: string
    ): Promise<Option<UserEntity>> {
        return await this.db
            .update(UsersDataPgTable)
            .set({ email })
            .where(eq(UsersDataPgTable.email, user.getProps().email))
            .then((result) => Some(this.mapper.toDomain(result)))
            .catch(() => None);
    }

    async updateUsername(
        user: UserEntity,
        username: string
    ): Promise<Option<UserEntity>> {
        return await this.db
            .update(UsersDataPgTable)
            .set({ username })
            .where(eq(UsersDataPgTable.username, user.getProps().username))
            .then((result: UserModel) => Some(this.mapper.toDomain(result)))
            .catch(() => None);
    }

    async updatePassword(
        user: UserEntity,
        password: string
    ): Promise<Option<UserEntity>> {
        return await this.db
            .update(UsersDataPgTable)
            .set({ password })
            .where(eq(UsersDataPgTable.id, user.getProps().id))
            .then((result: UserModel) => Some(this.mapper.toDomain(result)))
            .catch(() => None);
    }

    async delete(user: UserEntity) {
        const userFound = await this.findOneById(user.id);
        if (userFound.isSome()) {
            return this.db
                .delete(UsersDataPgTable)
                .where(eq(UsersDataPgTable.id, user.id))
                .then(() => Ok(true))
                .catch((err) => Err(err));
        } else {
            return Err(UserNotFoundError);
        }
    }
}
