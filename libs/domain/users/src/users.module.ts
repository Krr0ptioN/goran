import { Module } from '@nestjs/common';
import { UsersService } from './application/services';
import { configSchema } from '@goran/config';
import { DrizzleDataAccessModule } from '@goran/drizzle-data-access';
import { ConfigModule } from '@nestjs/config';
import { CreateUserCommandHandler, DeleteUserCommandHandler } from '@goran/users';
import { EventEmitterModule } from '@nestjs/event-emitter';

const commandHandlers = [CreateUserCommandHandler, DeleteUserCommandHandler];

@Module({
  imports: [
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
  providers: [...commandHandlers, UsersService],
  exports: [UsersService],
})
export class UsersModule { }
