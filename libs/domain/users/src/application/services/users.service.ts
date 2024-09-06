import { Injectable } from '@nestjs/common';
import {
    FindAllUsersPaginatedQuery,
    FindOneUserByEmailQuery,
    FindOneUserByIdQuery,
    FindOneUserByUsernameQuery,
} from '../queries';
import { UserDto, UserModel } from '../models';
import { UserMapper } from '../mappers';
import {
    ChangeUserEmailCommand,
    ChangeUserPasswordCommand,
    ChangeUserUsernameCommand,
    CreateUserCommand,
    DeleteUserCommand,
} from '../commands';
import { ProvideUsernameOrEmailError, UserEntity } from '../../domain';
import { ExceptionBase } from '@goran/common';
import { Err, Option, Result } from 'oxide.ts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class UsersService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly mapper: UserMapper
    ) { }

    async changeEmail(userDto: UserModel, newEmail: string) {
        const user = await this.mapper.toDomain(userDto);
        return await this.commandBus.execute(
            new ChangeUserEmailCommand({ user, newEmail })
        );
    }

    async changePassword(userDto: UserModel, newHashedPassword: string) {
        const user = await this.mapper.toDomain(userDto);
        return await this.commandBus.execute(
            new ChangeUserPasswordCommand({ user, newHashedPassword })
        );
    }

    async changePasswordByEntity(user: UserEntity, newHashedPassword: string) {
        return await this.commandBus.execute(
            new ChangeUserPasswordCommand({ user, newHashedPassword })
        );
    }

    async changeUsername(userDto: UserModel, newUsername: string) {
        const user = await this.mapper.toDomain(userDto);
        return await this.commandBus.execute(
            new ChangeUserUsernameCommand({ user, newUsername })
        );
    }

    async create(userDto: UserDto) {
        return await this.commandBus.execute(new CreateUserCommand(userDto));
    }

    async findAllPaginated(query: FindAllUsersPaginatedQuery) {
        return await this.queryBus.execute(query);
    }

    async findOneByEmail(
        email: string
    ): Promise<Result<UserModel, ExceptionBase>> {
        return await this.queryBus.execute(new FindOneUserByEmailQuery(email));
    }

    async findOneByUsername(
        username: string
    ): Promise<Result<UserModel, ExceptionBase>> {
        return await this.queryBus.execute(
            new FindOneUserByUsernameQuery(username)
        );
    }

    async findUserByIdenfitier({
        username,
        email,
    }: {
        username?: string;
        email?: string;
    }): Promise<Result<UserModel, ExceptionBase>> {
        if (email) {
            return await this.findOneByEmail(email);
        } else if (username) {
            return await this.findOneByUsername(username);
        } else {
            return Err(new ProvideUsernameOrEmailError());
        }
    }

    async findOneById(id: string): Promise<Option<UserModel>> {
        return await this.queryBus.execute(new FindOneUserByIdQuery(id));
    }

    async delete(command: DeleteUserCommand) {
        return await this.commandBus.execute(command);
    }
}
