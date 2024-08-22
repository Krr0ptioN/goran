import { ConflictException, Logger } from '@nestjs/common';
import { RequestUserPassswordResetCommand } from './request-user-password-reset.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordResetTokenFactory } from '../../factories';
import { UsersService } from '@goran/users';
import { PasswordResetRequestEntity } from '../../../domain';

@CommandHandler(RequestUserPassswordResetCommand)
export class RequestPasswordResetCommandHandler
    implements ICommandHandler<RequestUserPassswordResetCommand>
{
    private readonly logger = new Logger(RequestUserPassswordResetCommand.name);

    constructor(
        private readonly tokenFactory: PasswordResetTokenFactory,
        private readonly userService: UsersService
    ) {}

    async execute(command: RequestUserPassswordResetCommand) {
        const userResult = await this.userService.findOneByEmail(command.email);
        if (userResult.isErr())
            throw new ConflictException(userResult.unwrap());
        const token = this.tokenFactory.generate({ email: command.email });
        const passwordResetRequest = PasswordResetRequestEntity.create({
            user: userResult.unwrap(),
            passwordResetToken: token,
        });

        // TODO: Email the otpcode to user

        this.logger.log('Password reset requested for ' + command.email);
    }
}
