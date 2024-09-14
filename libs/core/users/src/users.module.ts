import { Module } from '@nestjs/common';
import { UsersService } from './application/services';
import { CreateUserCommandHandler } from './application/commands/create-user';
import { DeleteUserCommandHandler } from './application/commands/delete-user/delete-user.command-handler';
import {
    FindAllUsersPaginatedQueryHandler,
    FindOneUserByEmailQueryHandler,
    FindOneUserByIdQueryHandler,
    FindOneUserByUsernameQueryHandler,
} from './application/queries';
import {
    ReadModelUsersRepository,
    WriteModelUsersRepository,
} from './application/ports';
import { PostgreSqlDrizzleUsersRepository } from './infrastructure/persistence/drizzle/postgres-drizzle-users.repository';
import { UserMapper } from './application/mappers/user.mapper';
import { CqrsModule } from '@nestjs/cqrs';

const writeRepo = {
    provide: WriteModelUsersRepository,
    useClass: PostgreSqlDrizzleUsersRepository,
};

const readRepo = {
    provide: ReadModelUsersRepository,
    useClass: PostgreSqlDrizzleUsersRepository,
};

const commands = [CreateUserCommandHandler, DeleteUserCommandHandler];

const queries = [
    FindAllUsersPaginatedQueryHandler,
    FindOneUserByEmailQueryHandler,
    FindOneUserByIdQueryHandler,
    FindOneUserByUsernameQueryHandler,
];

@Module({
    imports: [CqrsModule],
    providers: [
        UserMapper,
        ...queries,
        ...commands,
        writeRepo,
        readRepo,
        UsersService,
    ],
    exports: [UserMapper, UsersService],
})
export class UsersModule {}
