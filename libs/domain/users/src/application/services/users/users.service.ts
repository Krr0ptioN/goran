import { Injectable } from '@nestjs/common';
import {
    CreateUserCommand,
    DeleteUserCommand,
    FindAllUsersPaginatedQuery,
    FindOneUserByEmailQuery,
    FindOneUserByIdQuery,
    FindOneUserByUsernameQuery,
    UserEntity,
} from '@goran/users';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class UsersService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    changeEmail(userDto: UserEntity, newEmail: string) { }

    changePassword(hashedNewPassword: string, { id }: UserEntity) { }

    create(command: CreateUserCommand) {
        return this.commandBus.execute(command);
    }

    findAll(query: FindAllUsersPaginatedQuery) {
        return this.queryBus.execute(query);
    }

    findOneByEmail(query: FindOneUserByEmailQuery) {
        return this.queryBus.execute(query);
    }
    findOneByUsername(query: FindOneUserByUsernameQuery) {
        return this.queryBus.execute(query);
    }

    findOneById(query: FindOneUserByIdQuery) {
        return this.queryBus.execute(query);
    }

    delete(command: DeleteUserCommand) {
        return this.commandBus.execute(command);
    }
}
