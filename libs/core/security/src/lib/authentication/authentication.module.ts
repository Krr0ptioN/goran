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
    PasswordResetSessionService,
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
import { PasswordResetRequestRepository } from './application/ports';
import { PostgreSqlDrizzlePasswordResetRequestRepository } from './infrastructure/persistence/postgres-password-reset-request.repository';

const factories = [PasswordResetTokenFactory, AuthenticationTokenFactory];
const services = [
    AuthenticationTokenService,
    PasswordService,
    PasswordResetSessionService,
];
const mappers = [PasswordResetRequestMapper];

const repo = {
    provide: PasswordResetRequestRepository,
    useClass: PostgreSqlDrizzlePasswordResetRequestRepository,
};

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

const providers = [
    ...mappers,
    ...commandHanlders,
    ...services,
    ...factories,
    repo,
];

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
export class AuthenticationModule { }
