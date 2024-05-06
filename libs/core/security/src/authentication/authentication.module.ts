import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@goran/users';
import {
  AuthenticationController,
  AuthenticationTokenController,
  AuthenticationPasswordController,
} from './controllers';
import {
  AuthenticationService,
  AuthenticationTokenService,
  AuthenticationPasswordService,
} from './services';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from '@goran/mail';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({ global: true }),
    CacheModule.register({ isGlobal: true }),
    MailModule,
  ],
  exports: [
    AuthenticationService,
    AuthenticationTokenService,
    AuthenticationPasswordService,
  ],
  controllers: [
    AuthenticationController,
    AuthenticationPasswordController,
    AuthenticationTokenController,
  ],
  providers: [
    AuthenticationService,
    AuthenticationTokenService,
    AuthenticationPasswordService,
  ],
})
export class AuthenticationModule {}
