import { Module } from '@nestjs/common';
import { UsersService } from './application/services';
import { configSchema } from '@goran/config';
import { DrizzleDataAccessModule } from '@goran/drizzle-data-access';
import { ConfigModule } from '@nestjs/config';
import { CreateUserCommandHandler } from './application/commands/create-user';
import { DeleteUserCommandHandler } from './application/commands/delete-user/delete-user.command-handler';
import { UsersRepositoryProvider } from './application/ports/users.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';
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
        EventEmitterModule.forRoot({
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 10,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        }),
        DrizzleDataAccessModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env', '.env.local'],
            validationSchema: configSchema,
        }),
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
