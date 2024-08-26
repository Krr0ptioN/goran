import { BadRequestException, Logger } from '@nestjs/common';
import { VerifyPasswordResetAttemptCommand } from './verify-password-reset-attempt.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordResetRequestRepository } from '../../ports';
import { PasswordResetRequestMapper } from '../../mappers';
import { InvalidAuthenticationCredentials, OtpCodeVO } from '../../../domain';

@CommandHandler(VerifyPasswordResetAttemptCommand)
export class VerifyPasswordResetAttemptCommandHandler
    implements ICommandHandler<VerifyPasswordResetAttemptCommand>
{
    private readonly logger = new Logger(
        VerifyPasswordResetAttemptCommand.name
    );

    constructor(
        private readonly mapper: PasswordResetRequestMapper,
        private readonly repository: PasswordResetRequestRepository
    ) {}

    async execute(command: VerifyPasswordResetAttemptCommand) {
        const requestResult = await this.repository.findOneByToken(
            command.token
        );

        if (requestResult.isNone())
            throw new BadRequestException(
                new InvalidAuthenticationCredentials(
                    Error('Provided crednetials are invalid')
                )
            );

        const requestAgg = await this.mapper.toDomain(requestResult.unwrap());

        const verifyResult = requestAgg.verify(
            new OtpCodeVO({ value: command.otpcode })
        );

        if (verifyResult.isErr())
            throw new BadRequestException(verifyResult.unwrap());

        this.repository.save(requestAgg);
        return verifyResult.unwrap().resetToken;
    }
}
