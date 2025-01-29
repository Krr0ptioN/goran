import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import { DrizzleService, UsersTable } from '@goran/drizzle-data-access';
import {
    UserMapper,
    UserModel,
    WriteModelUsersRepository,
    ReadModelUsersRepository,
} from '../../../application';
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
    implements
    Partial<ReadModelUsersRepository>,
    Partial<WriteModelUsersRepository> {
    constructor(
        private readonly drizzleService: DrizzleService,
        private readonly mapper: UserMapper
    ) { }

    async findAllPaginated(
        params: PaginatedQueryParams
    ): Promise<Paginated<UserModel>> {
        const query = this.drizzleService.db
            .select()
            .from(UsersTable)
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
            .from(UsersTable)
            .where(eq(UsersTable.id, userId));

        const result = await query.execute();
        return result.length > 0 ? Some(result[0]) : None;
    }

    async findOneByEmail(email: string): Promise<Option<UserModel>> {
        return await this.drizzleService.db
            .select()
            .from(UsersTable)
            .where(eq(UsersTable.email, email))
            .then((result: UserModel[]) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async findOneByUsername(username: string): Promise<Option<UserModel>> {
        return await this.drizzleService.db
            .select()
            .from(UsersTable)
            .where(eq(UsersTable.username, username))
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
            .insert(UsersTable)
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
            .update(UsersTable)
            .set({ email })
            .where(eq(UsersTable.email, user.getProps().email))
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
            .update(UsersTable)
            .set({ username })
            .where(eq(UsersTable.username, user.getProps().username))
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
            .update(UsersTable)
            .set({ password })
            .where(eq(UsersTable.id, user.getProps().id))
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
            .delete(UsersTable)
            .where(eq(UsersTable.id, user.id))
            .then(() => Ok(true))
            .catch((err: Error) => Err(new UserDeletionFailedError(err)));
    }
}
