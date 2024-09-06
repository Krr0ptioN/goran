import { Logger } from '@nestjs/common';
import { SigninCommand } from './signin.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordService } from '../../services';
import { UsersService } from '@goran/users';
import { Result, Err, Ok } from 'oxide.ts';
import { InvalidAuthenticationCredentials } from '../../../domain';
import { AuthenticationCredentialDto } from '../../dtos';
import { ExceptionBase } from '@goran/common';
import { AuthenticationTokenFactory } from '../../factories';

@CommandHandler(SigninCommand)
export class SigninCommandHandler implements ICommandHandler<SigninCommand> {
    private readonly logger = new Logger(SigninCommand.name);

    constructor(
        private tokenFactory: AuthenticationTokenFactory,
        private passwordService: PasswordService,
        private usersService: UsersService
    ) {}

    async execute(
        command: SigninCommand
    ): Promise<Result<AuthenticationCredentialDto, ExceptionBase>> {
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
            user.password
        );

        if (!passwordIsValid) {
            return Err(new InvalidAuthenticationCredentials());
        }

        const tokens = this.tokenFactory.generateTokens({
            userId: user.id,
        });

        this.logger.verbose(`User with ${user.email} email is authenticated`);

        return Ok(new AuthenticationCredentialDto({ userId: user.id, tokens }));
    }
}
