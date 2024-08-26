import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@goran/users';
import {
    AuthenticationController,
    AuthenticationTokenController,
    PasswordResetController,
} from './presenters/http';
import {
    AuthenticationTokenService,
    PasswordService,
} from './application/services';
import {
    RequestPasswordResetCommandHandler,
    VerifyPasswordResetAttemptCommandHandler,
    ResetPasswordCommandHandler,
    SignupCommandHandler,
    SigninCommandHandler,
} from './application/commands';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from '@goran/mail';
import { CqrsModule } from '@nestjs/cqrs';
import {
    AuthenticationTokenFactory,
    PasswordResetTokenFactory,
} from './application/factories';
import { PasswordResetRequestMapper } from './application/mappers';

const factories = [PasswordResetTokenFactory, AuthenticationTokenFactory];
const services = [AuthenticationTokenService, PasswordService];
const mappers = [PasswordResetRequestMapper];

const commandHanlders = [
    SignupCommandHandler,
    SigninCommandHandler,
    RequestPasswordResetCommandHandler,
    ResetPasswordCommandHandler,
    VerifyPasswordResetAttemptCommandHandler,
];
const controllers = [
    AuthenticationController,
    PasswordResetController,
    AuthenticationTokenController,
];

const providers = [...mappers, ...commandHanlders, ...services, ...factories];

@Module({
    imports: [
        UsersModule,
        CqrsModule,
        JwtModule.register({ global: true }),
        CacheModule.register({ isGlobal: true }),
        MailModule,
    ],
    providers,
    exports: [...services],
    controllers,
})
export class AuthenticationModule {}
