import { Logger } from '@nestjs/common';
import { ChangeUserUsernameCommand } from './change-user-username.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository, UserEntity } from '@goran/users';

@CommandHandler(ChangeUserUsernameCommand)
export class ChangeUserUsernameCommandHandler
  implements ICommandHandler<ChangeUserUsernameCommand>
{
  private readonly logger = new Logger(ChangeUserUsernameCommandHandler.name);

  constructor(private readonly userRepo: UsersRepository) {}

  async execute(command: ChangeUserUsernameCommand) {
    this.logger.verbose(
      `Processing user specifics with ${command.email} email`
    );
    this.logger.debug(`User specifics: ${JSON.stringify(command)}`);
    const user = UserEntity.create({ ...command });
    this.logger.debug(`User created with ${user.getProps().email} email`);
    const dbResult = await this.userRepo.insertOne(user);

    return dbResult;
  }
}
