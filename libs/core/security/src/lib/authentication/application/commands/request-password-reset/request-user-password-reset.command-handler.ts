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
import { MailService } from '@goran/mail';
import { Err, Ok } from 'oxide.ts';

@CommandHandler(RequestUserPassswordResetCommand)
export class RequestPasswordResetCommandHandler
    implements ICommandHandler<RequestUserPassswordResetCommand>
{
    private readonly logger = new Logger(RequestUserPassswordResetCommand.name);

    constructor(
        private readonly tokenFactory: PasswordResetTokenFactory,
        private readonly userService: UsersService,
        private readonly passwordResetReqRepo: PasswordResetRequestRepository,
        private readonly mailService: MailService
    ) {}

    async execute(command: RequestUserPassswordResetCommand) {
        const userResult = await this.userService.findOneByEmail(command.email);

        if (userResult.isNone())
            return Err(new ConflictException(userResult.unwrap()));

        const token = this.tokenFactory.generate({ email: command.email });
        const passwordResetRequest = PasswordResetRequestAggregate.create({
            user: userResult.unwrap(),
            passwordResetToken: token,
        });

        const savingRequestResult = await this.passwordResetReqRepo.save(
            passwordResetRequest
        );

        if (savingRequestResult.isErr())
            return Err(
                new InternalServerErrorException(
                    'Unable to proceed this action'
                )
            );

        const props = passwordResetRequest.getProps();

        this.mailService.send({
            to: command.email,
            subject: '[GORAN] Password Reset Verification',
            from: 'info@goran.com',
            text: props.otpcode.unpack(),
        });

        return Ok({
            resetToken: props.passwordResetToken.resetToken,
        });
    }
}
