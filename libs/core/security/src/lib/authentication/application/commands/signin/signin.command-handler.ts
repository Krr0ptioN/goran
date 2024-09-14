import { Logger } from '@nestjs/common';
import { SigninCommand } from './signin.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordService, SessionsService } from '@goran/security';
import { UserMapper, UsersService } from '@goran/users';
import { Result, Err, Ok } from 'oxide.ts';
import { InvalidAuthenticationCredentials } from '../../../domain';
import { AuthenticationCredentialDto } from '../../dtos';
import { ExceptionBase, Guard } from '@goran/common';
import { IpLocatorService } from '@goran/ip-locator';
import { DeviceDetectorService } from '@goran/device-detector';

@CommandHandler(SigninCommand)
export class SigninCommandHandler implements ICommandHandler<SigninCommand> {
    private readonly logger = new Logger(SigninCommand.name);

    constructor(
        private readonly passwordService: PasswordService,
        private readonly ipLocator: IpLocatorService,
        private readonly sessionsService: SessionsService,
        private readonly deviceDetector: DeviceDetectorService,
        private readonly userMapper: UserMapper,
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
        const userDto = userResult.unwrap();
        const passwordIsValid = await this.passwordService.comparePassword(
            password,
            userDto.password
        );
        const user = await this.userMapper.toDomain(userDto);
        if (!passwordIsValid) {
            return Err(new InvalidAuthenticationCredentials());
        }

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

        this.logger.verbose(
            `User with ${userDto.email} email is authenticated`
        );

        return Ok(new AuthenticationCredentialDto({ userId: user.id, tokens }));
    }
}
