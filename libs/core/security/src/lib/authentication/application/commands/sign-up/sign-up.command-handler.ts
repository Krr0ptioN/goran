import { SignUpCommand } from './sign-up.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from '@goran/users';
import { Ok, Result } from 'oxide.ts';
import { ExceptionBase, Guard } from '@goran/common';
import { AuthenticationCredentialDto } from '../../dtos';
import { SessionsService } from '../../../../sessions';
import { PasswordService } from '../../../../password';
import { IpLocatorService } from '@goran/ip-locator';
import { DeviceDetectorService } from '@goran/device-detector';
import { PinoLogger } from 'nestjs-pino';

@CommandHandler(SignUpCommand)
export class SignUpCommandHandler implements ICommandHandler<SignUpCommand> {
    constructor(
        private readonly sessionsService: SessionsService,
        private readonly passwordService: PasswordService,
        private readonly usersService: UsersService,
        private readonly ipLocator: IpLocatorService,
        private readonly deviceDetector: DeviceDetectorService,
        private readonly logger: PinoLogger
    ) {}

    async execute(
        command: SignUpCommand
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

        const ipLocation = await this.ipLocator.getLocation(
            command.clientInfo.ip ?? ''
        );

        const device = !Guard.isEmpty(command.clientInfo.userAgent)
            ? this.deviceDetector.getDevice(command.clientInfo.userAgent ?? '')
            : 'Unknown';

        const sessionCreationResult = await this.sessionsService.createSession(
            user,
            command.clientInfo.ip ?? '',
            ipLocation,
            device
        );

        if (sessionCreationResult.isErr()) return sessionCreationResult;

        const [tokens,] = sessionCreationResult.unwrap();
        this.logger.info(`User with ${user.email} email signed up`);

        return Ok(new AuthenticationCredentialDto({ userId: user.id, tokens }));
    }
}
