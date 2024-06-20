import { Logger } from '@nestjs/common';
import { ChangeUserEmailCommand } from './change-user-email.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EmailAlreadyRegisteredError,
  UserEntity,
  UserNotFoundError,
  UsersRepository,
} from '@goran/users';
import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@goran/common';

// TODO: Adding confirmation step for changing uesr email
@CommandHandler(ChangeUserEmailCommand)
export class ChangeUserEmailCommandHandler implements ICommandHandler {
  private readonly logger = new Logger(ChangeUserEmailCommandHandler.name);

  constructor(private readonly userRepo: UsersRepository) {}

  async execute(
    command: ChangeUserEmailCommand
  ): Promise<
    Result<UserEntity, UserNotFoundError | EmailAlreadyRegisteredError>
  > {
    this.logger.verbose(
      `Processing user specifics with ${
        command.user.getProps().email
      } email to change email`
    );

    const newEmailAlreadyRegistered = await this.userRepo.findOneByEmail(
      command.newEmail
    );
    if (newEmailAlreadyRegistered.isSome())
      return Err(
        new EmailAlreadyRegisteredError(
          new Error('Targeting email is already registered')
        )
      );

    this.logger.debug(
      `User specifics: ${JSON.stringify(command.user.getProps())}`
    );

    try {
      const repoResult = await this.userRepo.updateEmail(
        command.user,
        command.newEmail
      );

      return Ok(repoResult.unwrap());
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserNotFoundError(error));
      }
      throw error;
    }
  }
}
