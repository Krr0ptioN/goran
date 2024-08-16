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
import {
    UserNotFoundError,
    ProvideUsernameOrEmailError,
    UserEntity,
} from '../../domain';
import { ExceptionBase } from '@goran/common';
import { Err, Ok, Option, Result } from 'oxide.ts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class UsersService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly mapper: UserMapper
    ) { }

    changeEmail(userDto: UserModel, newEmail: string) {
        const user = this.mapper.toDomain(userDto);
        return this.commandBus.execute(
            new ChangeUserEmailCommand({ user, newEmail })
        );
    }

    changePassword(userDto: UserModel, newHashedPassword: string) {
        const user = this.mapper.toDomain(userDto);
        return this.commandBus.execute(
            new ChangeUserPasswordCommand({ user, newHashedPassword })
        );
    }
    changeUsername(userDto: UserModel, newUsername: string) {
        const user = this.mapper.toDomain(userDto);
        return this.commandBus.execute(
            new ChangeUserUsernameCommand({ user, newUsername })
        );
    }

    create(userDto: UserDto) {
        return this.commandBus.execute(new CreateUserCommand(userDto));
    }

    findAllPaginated(query: FindAllUsersPaginatedQuery) {
        return this.queryBus.execute(query);
    }

    findOneByEmail(email: string) {
        return this.queryBus.execute(new FindOneUserByEmailQuery(email));
    }
    findOneByUsername(username: string) {
        return this.queryBus.execute(new FindOneUserByUsernameQuery(username));
    }

    async findUserByIdenfitier({
        username,
        email,
    }: {
        username?: string;
        email?: string;
    }): Promise<Result<UserEntity, ExceptionBase>> {
        let foundedUser: Option<UserEntity>;
        if (email) {
            foundedUser = await this.findOneByEmail(email);
        } else if (username) {
            foundedUser = await this.findOneByUsername(username);
        } else {
            return Err(new ProvideUsernameOrEmailError());
        }

        if (foundedUser.isSome()) {
            return Ok(foundedUser.unwrap());
        } else {
            return Err(new UserNotFoundError());
        }
    }

    findOneById(id: string) {
        return this.queryBus.execute(new FindOneUserByIdQuery(id));
    }

    delete(command: DeleteUserCommand) {
        return this.commandBus.execute(command);
    }
}
