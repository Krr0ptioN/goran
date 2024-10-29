import { SignInCommand } from './sign-in.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../../../sessions';
import { PasswordService } from '../../../../password';
import { UserMapper, UsersService } from '@goran/users';
import { Result, Err, Ok } from 'oxide.ts';
import { InvalidAuthenticationCredentials } from '../../../domain';
import { AuthenticationCredentialDto } from '../../dtos';
import { ExceptionBase, Guard } from '@goran/common';
import { IpLocatorService } from '@goran/ip-locator';
import { DeviceDetectorService } from '@goran/device-detector';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@CommandHandler(SignInCommand)
export class SignInCommandHandler implements ICommandHandler<SignInCommand> {
    constructor(
        private readonly passwordService: PasswordService,
        private readonly ipLocator: IpLocatorService,
        private readonly sessionsService: SessionsService,
        private readonly deviceDetector: DeviceDetectorService,
        private readonly userMapper: UserMapper,
        private readonly usersService: UsersService,
        @InjectPinoLogger(SignInCommandHandler.name)
        private readonly logger: PinoLogger
    ) { }

    async execute(
        command: SignInCommand
    ): Promise<Result<AuthenticationCredentialDto, ExceptionBase>> {
        const { username, email, password, clientInfo } = command;
        const userResult = await this.usersService.findUserByIdenfitier({
            username,
            email,
        });

        if (userResult.isErr()) {
            return Err(new InvalidAuthenticationCredentials());
        }
        const userDto = userResult.unwrap();
        const passwordIsValid = await this.passwordService.comparePassword(
            password,
            userDto.password
        );
        const user = await this.userMapper.toDomain(userDto);
        if (!passwordIsValid) {
            return Err(new InvalidAuthenticationCredentials());
        }

        const ip = clientInfo?.ip ?? '0.0.0.0';
        const userAgent = clientInfo?.userAgent ?? '';

        const ipLocation = await this.ipLocator.getLocation(ip);
        const device = !Guard.isEmpty(userAgent) ? this.deviceDetector.getDevice(userAgent) : 'Unknown';

        const sessionCreationResult = await this.sessionsService.createSession(
            user,
            ip,
            ipLocation,
            device
        );

        if (sessionCreationResult.isErr()) return sessionCreationResult;
        const [tokens] = sessionCreationResult.unwrap();

        this.logger.info(
            `User with ${userDto.email} email is authenticated`
        );

        return Ok(new AuthenticationCredentialDto({ userId: user.id, tokens }));
    }
}
