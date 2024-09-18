import { Global, Module } from '@nestjs/common';
import {
    PasswordResetRequestMapper,
    PasswordResetRequestRepository,
    PasswordResetSessionService,
    PasswordResetTokenFactory,
    RequestPasswordResetCommandHandler,
    ResetPasswordCommandHandler,
    VerifyPasswordResetAttemptCommandHandler,
} from './application';
import { PostgreSqlDrizzlePasswordResetRequestRepository } from './infrastructure';
import { PasswordModule } from '../password';

const commandHandlers = [
    RequestPasswordResetCommandHandler,
    VerifyPasswordResetAttemptCommandHandler,
    ResetPasswordCommandHandler,
];

const providers = [
    ...commandHandlers,
    {
        provide: PasswordResetRequestRepository,
        useClass: PostgreSqlDrizzlePasswordResetRequestRepository,
    },
    PasswordResetSessionService,
    PasswordResetRequestMapper,
    PasswordResetTokenFactory,
];

@Global()
@Module({
    providers,
    imports: [PasswordModule],
    exports: [PasswordResetSessionService],
})
export class PasswordResetModule { }
