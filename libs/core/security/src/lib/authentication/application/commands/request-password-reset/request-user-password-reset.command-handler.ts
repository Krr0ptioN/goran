import { Logger } from '@nestjs/common';
import { RequestUserPassswordResetCommand } from './request-user-password-reset.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(RequestUserPassswordResetCommand)
export class RequestPasswordResetCommandHandler
    implements ICommandHandler<RequestUserPassswordResetCommand> {
    private readonly logger = new Logger(RequestUserPassswordResetCommand.name);

    async execute(command: RequestUserPassswordResetCommand) {
        this.logger.log('Password reset requested for ' + command.email);
    }
}
