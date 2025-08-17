import { BadRequestException, Logger } from '@nestjs/common';
import { VerifyPasswordResetAttemptCommand } from './verify-password-reset-attempt.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordResetRequestRepository } from '../../ports';
import { OtpCodeVO } from '../../../../password';
import { PasswordResetSessionService } from '../../services/password-reset-session.service';

@CommandHandler(VerifyPasswordResetAttemptCommand)
export class VerifyPasswordResetAttemptCommandHandler
    implements ICommandHandler<VerifyPasswordResetAttemptCommand>
{
    private readonly logger = new Logger(
        VerifyPasswordResetAttemptCommand.name
    );

    constructor(
        private readonly repository: PasswordResetRequestRepository,
        private readonly sessionService: PasswordResetSessionService
    ) {}

    async execute(command: VerifyPasswordResetAttemptCommand) {
        const requestAgg = await this.sessionService.getAggByToken(
            command.token
        );

        const verifyResult = requestAgg.verify(
            new OtpCodeVO({ value: command.otpcode })
        );

        if (verifyResult.isErr())
            throw new BadRequestException(verifyResult.unwrap());

        const saveResult = await this.repository.save(requestAgg);
        return saveResult;
    }
}
