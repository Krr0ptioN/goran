import { Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import { ChangeUserEmailCommand } from './change-user-email.command';
import {
  ReadModelUsersRepository,
  WriteModelUsersRepository,
} from '../../ports';
import {
  EmailAlreadyRegisteredError,
  UserEntity,
  UserNotFoundError,
} from '../../../domain';
import { Err, Ok, Result } from 'oxide.ts';
import { ConflictException } from '@goran/common';

@CommandHandler(ChangeUserEmailCommand)
export class ChangeUserEmailCommandHandler
  implements
    ICommandHandler<
      ChangeUserEmailCommand,
      Result<UserEntity, UserNotFoundError | EmailAlreadyRegisteredError>
    >
{
  private readonly logger = new Logger(ChangeUserEmailCommandHandler.name);

  constructor(
    private readonly userWriteRepo: WriteModelUsersRepository,
    private readonly userReadRepo: ReadModelUsersRepository,
  ) {}

  async execute(
    command: ChangeUserEmailCommand,
  ): Promise<Result<UserEntity, UserNotFoundError | EmailAlreadyRegisteredError>> {
    this.logger.verbose(
      `Processing user specifics with ${command.user.getProps().email} email to change email`,
    );

    const newEmailAlreadyRegistered =
      await this.userReadRepo.findOneByEmail(command.newEmail);
    if (newEmailAlreadyRegistered.isSome()) {
      return Err(
        new EmailAlreadyRegisteredError(
          new Error('Targeting email is already registered'),
        ),
      );
    }

    this.logger.debug(
      `User specifics: ${JSON.stringify(command.user.getProps())}`,
    );

    try {
      const repoResult = await this.userWriteRepo.updateEmail(
        command.user,
        command.newEmail,
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
