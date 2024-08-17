import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "@goran/users";
import {
  AuthenticationController,
  AuthenticationTokenController,
  AuthenticationPasswordController,
} from "./presenters/http";
import {
  AuthenticationTokenService,
  AuthenticationPasswordService,
} from "./application/services";
import {
  RequestPasswordResetCommandHandler,
  VerifyPasswordResetAttemptCommandHandler,
  ResetPasswordCommandHandler,
  SignupCommandHandler,
  SigninCommandHandler,
} from "./application/commands";
import { CacheModule } from "@nestjs/cache-manager";
import { MailModule } from "@goran/mail";
import { CqrsModule } from "@nestjs/cqrs";

const services = [AuthenticationTokenService, AuthenticationPasswordService];

const commandHanlders = [
  SignupCommandHandler,
  SigninCommandHandler,
  RequestPasswordResetCommandHandler,
  ResetPasswordCommandHandler,
  VerifyPasswordResetAttemptCommandHandler,
];

@Module({
  imports: [
    UsersModule,
    CqrsModule,
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
