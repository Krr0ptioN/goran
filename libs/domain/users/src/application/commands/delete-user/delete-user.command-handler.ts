import { Inject, Logger } from '@nestjs/common';
import { DeleteUserCommand } from './delete-user.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UsersRepository,
  UserNotFoundError,
  UsersRepositoryProvider,
} from '@goran/users';
import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException, ExceptionBase } from '@goran/common';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  private readonly logger = new Logger(DeleteUserCommandHandler.name);

  constructor(
    @Inject(UsersRepositoryProvider) private readonly userRepo: UsersRepository
  ) {}

  async execute(
    command: DeleteUserCommand
  ): Promise<Result<boolean, ExceptionBase>> {
    this.logger.verbose(
      `Processing user specifics with ${command.user.getProps().email} email`
    );
    this.logger.debug(`User specifics: ${JSON.stringify(command)}`);
    try {
      const deletedUser = await this.userRepo.delete(command.user);
      if (deletedUser.isOk()) {
        this.logger.debug(
          `User with ${command.user.getProps().email} email has been deleted`
        );
        return Ok(deletedUser.unwrap());
      } else {
        return Err(deletedUser.unwrapErr());
      }
    } catch (error: any) {
      this.logger.debug(
        `Unable to delete user with ${command.user.getProps().email}`
      );
      if (error instanceof ConflictException) {
        return Err(new UserNotFoundError(error));
      }
      throw error;
    }
  }
}
