import { Logger } from '@nestjs/common';
import { SignupCommand } from './signup.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '@goran/users';
import { Ok, Result } from 'oxide.ts';
import { ExceptionBase, Guard } from '@goran/common';
import { AuthenticationCredentialDto } from '../../dtos';
import { SessionsService } from '../../../../sessions';
import { PasswordService } from '../../../../password';
import { IpLocatorService } from '@goran/ip-locator';
import { DeviceDetectorService } from '@goran/device-detector';

@CommandHandler(SignupCommand)
export class SignupCommandHandler implements ICommandHandler<SignupCommand> {
    constructor(
        private readonly sessionsService: SessionsService,
        private readonly passwordService: PasswordService,
        private readonly usersService: UsersService,
        private readonly ipLocator: IpLocatorService,
        private readonly deviceDetector: DeviceDetectorService
    ) {}
    private readonly logger = new Logger(SignupCommand.name);

    async execute(
        command: SignupCommand
    ): Promise<Result<AuthenticationCredentialDto, ExceptionBase>> {
        const hashedPassword = await this.passwordService.hashPassword(
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

        this.logger.verbose(`User with ${user.email} email signed up`);

        const sessionCreationResult = await this.sessionsService.createSession(
            user,
            command.clientInfo.ip ?? '',
            await this.ipLocator.getLocation(command.clientInfo.ip ?? ''),
            !Guard.isEmpty(command.clientInfo.userAgent)
                ? this.deviceDetector.getDevice(
                      command.clientInfo.userAgent ?? ''
                  )
                : undefined
        );

        const [tokens, session] = sessionCreationResult.unwrap();

        return Ok(new AuthenticationCredentialDto({ userId: user.id, tokens }));
    }
}
