import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@goran/users';
import {
  AuthenticationController,
  AuthenticationTokenController,
  AuthenticationPasswordController,
} from '../authentication/presenters/http';
import {
  AuthenticationService,
  AuthenticationTokenService,
  AuthenticationPasswordService,
} from './application/services';
import {
  RequestPasswordResetCommandHandler,
  VerifyPasswordResetAttemptCommandHandler,
  ResetPasswordCommandHandler,
} from './application/commands';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from '@goran/mail';

const services = [
  AuthenticationService,
  AuthenticationTokenService,
  AuthenticationPasswordService,
];

const commandHanlders = [
  RequestPasswordResetCommandHandler,
  ResetPasswordCommandHandler,
  VerifyPasswordResetAttemptCommandHandler,
];

@Module({
  imports: [
    UsersModule,
    JwtModule.register({ global: true }),
    CacheModule.register({ isGlobal: true }),
    MailModule,
  ],
  exports: [...services],
  controllers: [
    AuthenticationController,
    AuthenticationPasswordController,
    AuthenticationTokenController,
  ],
  providers: [...commandHanlders, ...services],
})
export class AuthenticationModule { }
