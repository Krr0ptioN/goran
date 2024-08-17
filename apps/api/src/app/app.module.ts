import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG_APP, configSchema } from '@goran/config';
import { UsersModule } from '@goran/users';
import { AuthenticationModule } from '@goran/security';
import { DatabaseModule } from '@goran/drizzle-data-access';

@Module({
  imports: [
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get(CONFIG_APP.DB_HOST),
        port: configService.get(CONFIG_APP.DB_PORT),
        user: configService.get(CONFIG_APP.DB_USER),
        password: configService.get(CONFIG_APP.DB_PASSWORD),
        database: configService.get(CONFIG_APP.DB_DATABASE),
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
      validationSchema: configSchema,
    }),
    UsersModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
