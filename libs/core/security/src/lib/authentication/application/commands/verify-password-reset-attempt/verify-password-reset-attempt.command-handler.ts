import { Logger } from '@nestjs/common';
import { VerifyPasswordResetAttemptCommand } from './verify-password-reset-attempt.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(VerifyPasswordResetAttemptCommand)
export class VerifyPasswordResetAttemptCommandHandler
    implements ICommandHandler<VerifyPasswordResetAttemptCommand> {
    private readonly logger = new Logger(VerifyPasswordResetAttemptCommand.name);

    // TODO: It should generate a password reset attempt token and return it to the user
    async execute(command: VerifyPasswordResetAttemptCommand) {
        this.logger.log(
            'Verify Password reset attempt requested for ' + command.email,
            command.otpcode
        );
    }
}
