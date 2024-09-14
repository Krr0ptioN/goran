import { Injectable } from '@nestjs/common';
import {
    UserMapper,
    UserModel,
    WriteModelUsersRepository,
    ReadModelUsersRepository,
} from '../../../application';
import {
    EmailAlreadyRegisteredError,
    UserEntity,
    UserNotFoundError,
    UsernameAlreadyRegisteredError,
} from '../../../domain';
import { faker } from '@faker-js/faker';
import { ulid } from 'ulid';
import { ExceptionBase, Paginated, PaginatedQueryParams } from '@goran/common';
import { paginateArray } from '@goran/utils';
import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';

@Injectable()
export class InMemoryUsersRepository
    implements
        Partial<ReadModelUsersRepository>,
        Partial<WriteModelUsersRepository>
{
    constructor(private readonly mapper: UserMapper) {
        this.users = [];
    }
    private users: UserModel[] = [];

    public static generateMockUser() {
        const id = ulid();
        const username = faker.internet.userName();
        const password = faker.internet.password();
        const fullname = faker.person.fullName();
        const email = faker.internet.email({ firstName: fullname });
        const createdAt = new Date();
        const updatedAt = new Date();

        return {
            id,
            username,
            email,
            password,
            fullname,
            createdAt,
            updatedAt,
        };
    }

    async findAllPaginated(params: PaginatedQueryParams) {
        const paginatedData = paginateArray(
            this.users,
            params.limit,
            params.offset
        );

        return new Paginated({
            data: paginatedData,
            count: paginatedData.length,
            limit: params.limit,
            page: params.page,
        });
    }

    async insertOne(
        userValue: UserEntity
    ): Promise<Result<UserEntity, ExceptionBase>> {
        const userByEmail = await this.findOneByEmail(
            userValue.getProps().email
        );
        if (userByEmail.isSome())
            return Err(new EmailAlreadyRegisteredError(new Error()));
        const userByUsername = await this.findOneByUsername(
            userValue.getProps().username
        );
        if (userByUsername.isSome())
            return Err(new UsernameAlreadyRegisteredError(new Error()));

        const value = this.mapper.toPersistence(userValue);
        const newLength = this.users.push(value);
        return Ok(await this.mapper.toDomain(this.users[newLength - 1]));
    }

    findAll(): Promise<UserModel[]> {
        return Promise.resolve(this.users);
    }

    async findOneById(userId: string): Promise<Option<UserModel>> {
        const result = this.users.find((user) => user.id === userId);
        if (result) return Some(result);
        else return None;
    }

    async findOneByEmail(email: string): Promise<Option<UserModel>> {
        const result = this.users.find((user) => user.email === email);
        if (result) return Some(result);
        else return None;
    }

    async findOneByUsername(username: string): Promise<Option<UserModel>> {
        const result = this.users.find((user) => user.username === username);
        if (result) return Some(result);
        else return None;
    }

    async updateEmail(
        user: UserEntity,
        email: string
    ): Promise<Option<UserEntity>> {
        const userIndex = this.users.findIndex(
            (userRepo) => userRepo.id === user.id
        );

        if (userIndex === -1) {
            return None;
        }

        this.users[userIndex].email = email;
        this.users[userIndex].updatedAt = new Date();

        return Some(await this.mapper.toDomain(this.users[userIndex]));
    }

    async updatePassword(
        user: UserEntity,
        password: string
    ): Promise<Option<UserEntity>> {
        const userIndex = this.users.findIndex(
            (userRepo) => userRepo.id === user.id
        );

        if (userIndex === -1) {
            return None;
        }

        this.users[userIndex].password = password;
        this.users[userIndex].updatedAt = new Date();

        return Some(await this.mapper.toDomain(this.users[userIndex]));
    }

    async updateUsername(
        user: UserEntity,
        username: string
    ): Promise<Option<UserEntity>> {
        const userIndex = this.users.findIndex(
            (userRepo) => userRepo.id === user.id
        );

        if (userIndex === -1) {
            return None;
        }

        this.users[userIndex].username = username;
        this.users[userIndex].updatedAt = new Date();

        return Some(await this.mapper.toDomain(this.users[userIndex]));
    }

    async delete(user: UserEntity): Promise<Result<boolean, ExceptionBase>> {
        const userIndex = this.users.findIndex((userRepo) => {
            return user.id === userRepo.id;
        });

        if (userIndex === -1) {
            return Err(new UserNotFoundError(new Error()));
        }

        this.users.splice(userIndex, 1);

        return Ok(true);
    }
}
