import { Logger } from '@nestjs/common';
import { SignupCommand } from './signup.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordService, AuthenticationTokenService } from '../../services';
import { UsersService } from '@goran/users';
import { Ok, Result } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { AuthenticationCredentialDto } from '../../dtos';
import { AuthenticationTokenFactory } from '../../factories';

@CommandHandler(SignupCommand)
export class SignupCommandHandler implements ICommandHandler<SignupCommand> {
    constructor(
        private tokenFactory: AuthenticationTokenFactory,
        private passwordService: PasswordService,
        private usersService: UsersService
    ) {}
    private readonly logger = new Logger(SignupCommand.name);

    async execute(
        command: SignupCommand
    ): Promise<Result<AuthenticationCredentialDto, ExceptionBase>> {
        const hashedPassword = this.passwordService.hashPassword(
            command.password
        );
        const userResult = await this.usersService.create({
            ...command,
            password: hashedPassword,
        });

        if (userResult.isErr()) {
            return userResult;
        }

        const user = userResult.unwrap();
        const tokens = this.tokenFactory.generateTokens({
            userId: user.getProps().id,
        });

        this.logger.verbose(`User with ${user.email} email signed up`);

        return Ok(new AuthenticationCredentialDto({ user, tokens }));
    }
}
