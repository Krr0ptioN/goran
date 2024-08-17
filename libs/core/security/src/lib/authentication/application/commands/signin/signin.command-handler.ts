import { Logger } from '@nestjs/common';
import { SigninCommand } from './signin.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AuthenticationPasswordService,
  AuthenticationTokenService,
} from '../../services';
import { UsersService } from '@goran/users';
import { Result, Err, Ok } from 'oxide.ts';
import { InvalidAuthenticationCredentials, } from '../../../domain';
import { AuthenticationCredentialDto } from '../../dtos';
import { ExceptionBase } from '@goran/common';

@CommandHandler(SigninCommand)
export class SigninCommandHandler implements ICommandHandler<SigninCommand> {
  private readonly logger = new Logger(SigninCommand.name);

  constructor(
    private tokenService: AuthenticationTokenService,
    private passwordService: AuthenticationPasswordService,
    private usersService: UsersService
  ) { }

  async execute(command: SigninCommand): Promise<Result<AuthenticationCredentialDto, ExceptionBase>> {
    const { username, email, password } = command;
    const userResult = await this.usersService.findUserByIdenfitier({
      username,
      email,
    });

    if (userResult.isErr()) {
      return Err(new InvalidAuthenticationCredentials());
    }
    const user = userResult.unwrap();
    const passwordIsValid = await this.passwordService.validatePassword(
      password,
      user.getProps().password
    );

    if (!passwordIsValid) {
      return Err(new InvalidAuthenticationCredentials());
    }

    const tokens = this.tokenService.generateTokens({
      userId: userResult.unwrap().getProps().id,
    });

    this.logger.verbose(`User with ${user.getProps().email} email is authenticated`);

    return Ok(new AuthenticationCredentialDto({ user, tokens }));
  }
}