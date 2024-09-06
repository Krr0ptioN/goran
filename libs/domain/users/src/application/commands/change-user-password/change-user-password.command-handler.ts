import { Inject, Logger } from '@nestjs/common';
import { ChangeUserPasswordCommand } from './change-user-password.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WriteModelUsersRepository } from '../../ports';

@CommandHandler(ChangeUserPasswordCommand)
export class ChangeUserPasswordCommandHandler
    implements ICommandHandler<ChangeUserPasswordCommand>
{
    private readonly logger = new Logger(ChangeUserPasswordCommandHandler.name);

    constructor(private readonly userRepo: WriteModelUsersRepository) {}

    async execute(command: ChangeUserPasswordCommand) {
        this.logger.verbose(
            `Processing user specifics with ${
                command.user.getProps().email
            } email`
        );
        this.logger.debug(`User specifics: ${JSON.stringify(command)}`);
        const dbResult = await this.userRepo.updateUsername(
            command.user,
            command.newHashedPassword
        );

        if (dbResult.isSome())
            this.logger.debug(
                `User's password with ${
                    command.user.getProps().email
                } email is updated`
            );
        else
            this.logger.debug(
                `Failed to update user's password with ${
                    command.user.getProps().email
                } email`
            );
        return dbResult;
    }
}
