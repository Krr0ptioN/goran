import { Logger } from '@nestjs/common';
import { SigninCommand } from './signin.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AuthenticationPasswordService,
  AuthenticationTokenService,
} from '../../services';
import { UsersService } from '@goran/users';
import { Err, Ok } from 'oxide.ts';
import { InvalidAuthenticationCredentials } from '../../../domain/errors/invalid-authentication-crednetials.error';

@CommandHandler(SigninCommand)
export class SigninCommandHandler implements ICommandHandler<SigninCommand> {
  private readonly logger = new Logger(SigninCommand.name);

  constructor(
    private tokenService: AuthenticationTokenService,
    private passwordService: AuthenticationPasswordService,
    private usersService: UsersService
  ) {}

  async execute(command: SigninCommand) {
    const { username, email, password } = command;
    const userResult = await this.usersService.findUserByIdenfitier({
      username,
      email,
    });

    if (userResult.isErr()) {
      return Err(new InvalidAuthenticationCredentials());
    }
    const userProps = userResult.unwrap().getProps();
    const passwordIsValid = await this.passwordService.validatePassword(
      password,
      userProps.password
    );

    if (!passwordIsValid) {
      return Err(new InvalidAuthenticationCredentials());
    }

    const tokens = this.tokenService.generateTokens({
      userId: userResult.unwrap().getProps().id,
    });

    this.logger.verbose(`User with ${userProps.email} email is authenticated`);

    return Ok({ user: userResult, tokens });
  }
}
