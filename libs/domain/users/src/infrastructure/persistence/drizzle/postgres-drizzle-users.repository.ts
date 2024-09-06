import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import { DrizzleService, UsersDataPgTable } from '@goran/drizzle-data-access';
import { UsersRepository, UserMapper, UserModel } from '../../../application';
import {
    UserAlreadyExistsError,
    UserNotFoundError,
    UserEntity,
    UserCreationFailedError,
    UserDeletionFailedError,
} from '../../../domain';
import { Some, None, Option, Ok, Err, Result } from 'oxide.ts';
import { ExceptionBase, Paginated, PaginatedQueryParams } from '@goran/common';

@Injectable()
export class PostgreSqlDrizzleUsersRepository
    implements Partial<UsersRepository>
{
    constructor(
        private readonly drizzleService: DrizzleService,
        private readonly mapper: UserMapper
    ) {}

    async findAllPaginated(
        params: PaginatedQueryParams
    ): Promise<Paginated<UserModel>> {
        const query = this.drizzleService.db
            .select()
            .from(UsersDataPgTable)
            .limit(params.limit)
            .offset(params.offset);

        const records = await query.execute();

        return new Paginated({
            data: records,
            count: records.length,
            limit: params.limit,
            page: params.page,
        });
    }

    async findOneById(userId: string): Promise<Option<UserModel>> {
        const query = this.drizzleService.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.id, userId));

        const result = await query.execute();
        return result.length > 0 ? Some(result[0]) : None;
    }

    async findOneByEmail(email: string): Promise<Option<UserModel>> {
        return await this.drizzleService.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.email, email))
            .then((result: UserModel[]) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async findOneByUsername(username: string): Promise<Option<UserModel>> {
        return await this.drizzleService.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.username, username))
            .then((result: UserModel[]) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async insertOne(
        user: UserEntity
    ): Promise<Result<UserEntity, ExceptionBase>> {
        const userFound = await this.findOneById(user.id);
        if (userFound.isSome()) return Err(new UserAlreadyExistsError());
        const persistenceModel = this.mapper.toPersistence(user);

        if (
            !persistenceModel.id ||
            !persistenceModel.username ||
            !persistenceModel.email ||
            !persistenceModel.password
        ) {
            return Err(
                new UserCreationFailedError(
                    new Error('Missing required fields')
                )
            );
        }

        const recordToInsert = {
            id: persistenceModel.id,
            username: persistenceModel.username,
            email: persistenceModel.email,
            password: persistenceModel.password,
            createdAt: persistenceModel.createdAt || new Date(),
            updatedAt: persistenceModel.updatedAt || new Date(),
            fullname: persistenceModel.fullname ?? null,
        };
        return await this.drizzleService.db
            .insert(UsersDataPgTable)
            .values(recordToInsert)
            .returning()
            .then(async (result: UserModel[]) =>
                Ok(await this.mapper.toDomain(result[0]))
            )
            .catch((err: Error) => Err(new UserCreationFailedError(err)));
    }

    async updateEmail(
        user: UserEntity,
        email: string
    ): Promise<Option<UserEntity>> {
        return await this.drizzleService.db
            .update(UsersDataPgTable)
            .set({ email })
            .where(eq(UsersDataPgTable.email, user.getProps().email))
            .returning()
            .then(async (result: UserModel[]) =>
                Some(await this.mapper.toDomain(result[0]))
            )
            .catch(() => None);
    }

    async updateUsername(
        user: UserEntity,
        username: string
    ): Promise<Option<UserEntity>> {
        return await this.drizzleService.db
            .update(UsersDataPgTable)
            .set({ username })
            .where(eq(UsersDataPgTable.username, user.getProps().username))
            .returning()
            .then(async (result: UserModel[]) =>
                Some(await this.mapper.toDomain(result[0]))
            )
            .catch(() => None);
    }

    async updatePassword(
        user: UserEntity,
        password: string
    ): Promise<Option<UserEntity>> {
        return await this.drizzleService.db
            .update(UsersDataPgTable)
            .set({ password })
            .where(eq(UsersDataPgTable.id, user.getProps().id))
            .returning()
            .then(async (result: UserModel[]) =>
                Some(await this.mapper.toDomain(result[0]))
            )
            .catch(() => None);
    }

    async delete(user: UserEntity) {
        const userFound = await this.findOneById(user.id);
        if (userFound.isNone()) return Err(new UserNotFoundError());
        return this.drizzleService.db
            .delete(UsersDataPgTable)
            .where(eq(UsersDataPgTable.id, user.id))
            .then(() => Ok(true))
            .catch((err: Error) => Err(new UserDeletionFailedError(err)));
    }
}
