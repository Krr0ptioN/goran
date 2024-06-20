import { Module } from '@nestjs/common';
import { PasswordService, UsersService } from './services';
import { UsersController } from '../presenters/http/users.controller';
import { configSchema } from '@goran/config';
import { DbDataAccessModule } from '@goran/drizzle-data-access';
import { ConfigModule } from '@nestjs/config';
import { CreateUserCommandHandler } from './commands/create-user/create-user.command-handler';
import { DeleteUserCommandHandler } from './commands/delete-user/delete-user.command-handler';

const commandHandlers = [CreateUserCommandHandler, DeleteUserCommandHandler];

@Module({
  controllers: [UsersController],
  imports: [
    DbDataAccessModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: configSchema,
    }),
  ],
  providers: [...commandHandlers, UsersService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
