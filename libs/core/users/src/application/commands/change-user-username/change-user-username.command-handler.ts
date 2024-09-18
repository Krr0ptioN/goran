import { Logger } from '@nestjs/common';
import { ChangeUserUsernameCommand } from './change-user-username.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WriteModelUsersRepository } from '../../ports';

@CommandHandler(ChangeUserUsernameCommand)
export class ChangeUserUsernameCommandHandler
    implements ICommandHandler<ChangeUserUsernameCommand>
{
    private readonly logger = new Logger(ChangeUserUsernameCommandHandler.name);

    constructor(private readonly userRepo: WriteModelUsersRepository) {}

    async execute(command: ChangeUserUsernameCommand) {
        this.logger.verbose(
            `Processing user specifics with ${
                command.user.getProps().email
            } email`
        );
        this.logger.debug(`User specifics: ${JSON.stringify(command)}`);
        const dbResult = await this.userRepo.updateUsername(
            command.user,
            command.newUsername
        );

        if (dbResult.isSome())
            this.logger.debug(
                `User's username with ${
                    command.user.getProps().email
                } email is updated.`
            );
        else
            this.logger.debug(
                `Failed to update user's username with ${
                    command.user.getProps().email
                } email`
            );

        return dbResult;
    }
}
