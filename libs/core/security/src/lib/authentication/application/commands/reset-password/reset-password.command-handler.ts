import { BadRequestException, Logger } from '@nestjs/common';
import { ResetPasswordCommand } from './reset-password.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordResetRequestRepository } from '../../ports';
import { PasswordResetRequestMapper } from '../../mappers';
import { InvalidAuthenticationCredentials } from '../../../domain';
import { PasswordService } from '../../services';
import { UsersService } from '@goran/users';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
    implements ICommandHandler<ResetPasswordCommand>
{
    private readonly logger = new Logger(ResetPasswordCommand.name);

    constructor(
        private readonly mapper: PasswordResetRequestMapper,
        private readonly repository: PasswordResetRequestRepository,
        private readonly passwordService: PasswordService,
        private readonly usersService: UsersService
    ) {}

    async execute(command: ResetPasswordCommand) {
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

        const hashedPassword = this.passwordService.hashPassword(
            command.password
        );

        requestAgg.passwordChanged();

        return this.usersService.changePasswordByEntity(
            requestAgg.getProps().user,
            hashedPassword
        );
    }
}
