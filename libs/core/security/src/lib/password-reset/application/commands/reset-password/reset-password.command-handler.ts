import { Logger } from '@nestjs/common';
import { ResetPasswordCommand } from './reset-password.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordService } from '../../../../password/application';
import { UsersService } from '@goran/users';
import { PasswordResetSessionService } from '../../services/password-reset-session.service';
import { PasswordResetRequestRepository } from '../../ports';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
    implements ICommandHandler<ResetPasswordCommand> {
    private readonly logger = new Logger(ResetPasswordCommand.name);

    constructor(
        private readonly sessionService: PasswordResetSessionService,
        private readonly repository: PasswordResetRequestRepository,
        private readonly passwordService: PasswordService,
        private readonly usersService: UsersService
    ) { }

    async execute(command: ResetPasswordCommand) {
        const requestAgg = await this.sessionService.getAggByToken(
            command.token
        );

        const hashedPassword = await this.passwordService.hashPassword(
            command.password
        );

        requestAgg.passwordChanged();
        await this.repository.save(requestAgg);

        return this.usersService.changePasswordByEntity(
            requestAgg.getProps().user,
            hashedPassword
        );
    }
}
