import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import { drizzle } from 'drizzle-orm/node-postgres';
import {
    DbDataAccessProvider,
    UsersDataPgTable,
} from '@goran/drizzle-data-access';
import {
    UsersRepository,
    UserMapper,
    UserModel,
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
    implements Partial<UsersRepository> {
    constructor(
        @Inject(DbDataAccessProvider)
        private readonly db: ReturnType<typeof drizzle>,
        private readonly mapper: UserMapper
    ) { }

    async findAllPaginated(params: PaginatedQueryParams): Promise<Paginated<UserModel>> {
        const query = this.db
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
        const query = this.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.id, userId));

        const result = await query.execute();
        return result.length > 0 ? Some(result[0]) : None;
    }

    async findOneByEmail(email: string): Promise<Option<UserModel>> {
        return await this.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.email, email))
            .then((result: UserModel[]) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async findOneByUsername(username: string): Promise<Option<UserModel>> {
        return await this.db
            .select()
            .from(UsersDataPgTable)
            .where(eq(UsersDataPgTable.username, username))
            .then((result: UserModel[]) => {
                return result && result.length > 0 ? Some(result[0]) : None;
            });
    }

    async insertOne(user: UserEntity) {
        const userFound = await this.findOneById(user.id);
        if (userFound.isSome()) {
            return this.db
                .insert(UsersDataPgTable)
                .values(this.mapper.toPersistence(user))
                .returning()
                .then((result: UserModel[]) => Ok(this.mapper.toDomain(result[0])))
                .catch((err) => Err(err));
        } else {
            return Err(new UserAlreadyExistsError());
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
            .returning()
            .then((result: UserModel[]) => Some(this.mapper.toDomain(result[0])))
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
            .returning()
            .then((result: UserModel[]) => Some(this.mapper.toDomain(result[0])))
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
            .returning()
            .then((result: UserModel[]) => Some(this.mapper.toDomain(result[0])))
            .catch(() => None);
    }

    async delete(user: UserEntity) {
        const userFound = await this.findOneById(user.id);
        if (userFound.isSome()) {
            return await this.db
                .delete(UsersDataPgTable)
                .where(eq(UsersDataPgTable.id, user.id))
                .then(() => Ok(true))
                .catch((err) => Err(err));
        } else {
            return Err(UserNotFoundError);
        }
    }
}
