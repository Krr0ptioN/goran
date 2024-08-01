import { Logger } from '@nestjs/common';
import { ResetPasswordCommand } from './reset-password.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
    implements ICommandHandler<ResetPasswordCommand> {
    private readonly logger = new Logger(ResetPasswordCommand.name);

    async execute(command: ResetPasswordCommand) {
        this.logger.log(
            'Verify Password reset attempt requested for ' +
            command.passwordResetAttemptToken,
            command.newPassword
        );
    }
}
