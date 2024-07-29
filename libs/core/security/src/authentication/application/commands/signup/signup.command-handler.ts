import { Logger } from '@nestjs/common';
import { SignupCommand } from './signup.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AuthenticationPasswordService,
  AuthenticationTokenService,
} from '../../services';
import { UsersService } from '@goran/users';

@CommandHandler(SignupCommand)
export class SignupCommandHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private tokenService: AuthenticationTokenService,
    private passwordService: AuthenticationPasswordService,
    private usersService: UsersService
  ) {}
  private readonly logger = new Logger(SignupCommand.name);

  async execute(command: SignupCommand) {
    const hashedPassword = this.passwordService.hashPassword(command.password);
    const userResult = await this.usersService.create({
      ...command,
      password: hashedPassword,
    });

    if (userResult.isErr()) {
      return userResult;
    }

    const tokens = this.tokenService.generateTokens({
      userId: userResult.id,
    });
    this.logger.verbose(`User with ${userResult.email} email signed up`);
    return { user: userResult, tokens };
  }
}
