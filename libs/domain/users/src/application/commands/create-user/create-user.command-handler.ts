import { Inject, Logger } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UsersRepository,
  UsersRepositoryProvider,
} from '../../ports/users.repository';
import {
  UserEntity,
} from '../../../domain/entities';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new Logger(CreateUserCommandHandler.name);

  constructor(
    @Inject(UsersRepositoryProvider) private readonly userRepo: UsersRepository,
  ) { }

  async execute(command: CreateUserCommand) {
    this.logger.debug(
      `Processing user specifics with ${command.email} email`
    );
    this.logger.debug(`User specifics: ${JSON.stringify(command)}`);

    const user = UserEntity.create(command);

    const repoResult = await this.userRepo.insertOne(user);

    if (repoResult.isOk())
      this.logger.verbose(`User created with ${user.getProps().email} email`);

    return repoResult;
  }
}
