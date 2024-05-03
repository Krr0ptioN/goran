import { Module } from '@nestjs/common';
import { UsersService } from '../services';
import { UsersController } from '../controllers';
import { NeonDrizzleUsersRepository, USERS_REPOSITORY } from '../repositories';
import { CONFIG_APP, configSchema } from '@goran/config';
import { DbDataAccessModule } from '@goran/db-data-access';
import { ConfigModule } from '@nestjs/config';
import { MockUsersRepository } from '../repositories/user-mock.repository';

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
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: process.env[CONFIG_APP.DRIZZLE_DATABASE_URL]
        ? NeonDrizzleUsersRepository
        : MockUsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
