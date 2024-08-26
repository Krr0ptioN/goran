import {
    ConflictException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { RequestUserPassswordResetCommand } from './request-user-password-reset.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordResetTokenFactory } from '../../factories';
import { UsersService } from '@goran/users';
import { PasswordResetRequestAggregate } from '../../../domain';
import { PasswordResetRequestRepository } from '../../ports';

@CommandHandler(RequestUserPassswordResetCommand)
export class RequestPasswordResetCommandHandler
    implements ICommandHandler<RequestUserPassswordResetCommand>
{
    private readonly logger = new Logger(RequestUserPassswordResetCommand.name);

    constructor(
        private readonly tokenFactory: PasswordResetTokenFactory,
        private readonly userService: UsersService,
        private readonly passwordResetReqRepo: PasswordResetRequestRepository
    ) {}

    async execute(command: RequestUserPassswordResetCommand) {
        const userResult = await this.userService.findOneByEmail(command.email);

        if (userResult.isNone())
            throw new ConflictException(userResult.unwrap());

        const token = this.tokenFactory.generate({ email: command.email });
        const passwordResetRequest = PasswordResetRequestAggregate.create({
            user: userResult.unwrap(),
            passwordResetToken: token,
        });

        const savingRequestResult = await this.passwordResetReqRepo.save(
            passwordResetRequest
        );

        if (savingRequestResult.isErr())
            throw new InternalServerErrorException(
                'Unable to proceed this action'
            );

        // TODO: Email the otpcode to user

        const props = passwordResetRequest.getProps();
        return {
            token: props.passwordResetToken.resetToken,
            email: props.user.getProps().email,
        };
    }
}
