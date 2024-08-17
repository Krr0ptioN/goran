import { Module } from '@nestjs/common';
import { UsersService } from './application/services';
import { CreateUserCommandHandler } from './application/commands/create-user';
import { DeleteUserCommandHandler } from './application/commands/delete-user/delete-user.command-handler';
import { UsersRepositoryProvider } from './application/ports/users.repository';
import { PostgreSqlDrizzleUsersRepository } from './infrastructure/persistence/drizzle/postgres-drizzle-users.repository';
import { UserMapper } from './application/mappers/user.mapper';
import { CqrsModule } from '@nestjs/cqrs';

const repo = {
    provide: UsersRepositoryProvider,
    useClass: PostgreSqlDrizzleUsersRepository,
};

@Module({
    imports: [
        CqrsModule,
    ],
    providers: [
        CreateUserCommandHandler,
        DeleteUserCommandHandler,
        UserMapper,
        repo,
        UsersService,
    ],
    exports: [UsersService],
})
export class UsersModule { }
