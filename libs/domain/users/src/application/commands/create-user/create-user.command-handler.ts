import { Logger } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository, UserEntity } from '@goran/users';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  private readonly logger = new Logger(CreateUserCommandHandler.name);

  constructor(private readonly userRepo: UsersRepository) {}

  async execute(command: CreateUserCommand) {
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
