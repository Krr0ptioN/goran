import { Test } from '@nestjs/testing';
import { SignInCommandHandler } from './sign-in.command-handler';
import { SignInCommand } from './sign-in.command';
import {
    UserEntity,
    UserModel,
    UsersService,
    UserMapper
} from '@goran/users';
import {
    SessionCreationFailedError,
    SessionsService,
    SessionEntity
} from '../../../../sessions';
import { PasswordService } from '../../../../password';
import { IpLocatorService } from '@goran/ip-locator';
import { DeviceDetectorService } from '@goran/device-detector';
import { Ok, Err } from 'oxide.ts';
import { AuthenticationCredentialDto } from '../../dtos';
import { TokenValueObject } from '../../../../tokens';
import { InvalidAuthenticationCredentials } from "../../../domain";

describe('SignInCommandHandler', () => {
    let handler: SignInCommandHandler;
    let usersService: jest.Mocked<UsersService>;
    let sessionsService: jest.Mocked<SessionsService>;
    let passwordService: jest.Mocked<PasswordService>;
    let ipLocatorService: jest.Mocked<IpLocatorService>;
    let deviceDetectorService: jest.Mocked<DeviceDetectorService>;
    let userMapper: jest.Mocked<UserMapper>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SignInCommandHandler,
                {
                    provide: UsersService,
                    useValue: {
                        findUserByIdenfitier: jest.fn(),
                    },
                },
                {
                    provide: SessionsService,
                    useValue: {
                        createSession: jest.fn(),
                    },
                },
                {
                    provide: PasswordService,
                    useValue: {
                        comparePassword: jest.fn(),
                    },
                },
                {
                    provide: IpLocatorService,
                    useValue: {
                        getLocation: jest.fn(),
                    },
                },
                {
                    provide: DeviceDetectorService,
                    useValue: {
                        getDevice: jest.fn(),
                    },
                },
                UserMapper,
            ],
        }).compile();

        handler = module.get<SignInCommandHandler>(SignInCommandHandler);
        usersService = module.get(UsersService);
        sessionsService = module.get(SessionsService);
        passwordService = module.get(PasswordService);
        ipLocatorService = module.get(IpLocatorService);
        deviceDetectorService = module.get(DeviceDetectorService);
        userMapper = module.get(UserMapper);
    });

    it('should successfully sign in a user', async () => {
        const command = new SignInCommand({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            clientInfo: { ip: '127.0.0.1', userAgent: 'test-agent' },
        });

        const user = UserEntity.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedPassword123',
        });

        const tokens = new TokenValueObject({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });
        const session = SessionEntity.create({
            refreshToken: tokens.refreshToken,
            ip: '127.0.0.1',
            device: 'Local Device',
            location: 'Germany (GER) / Berlin (Brl)',
            userId: user.id,
        });

        passwordService.comparePassword.mockResolvedValue(true);
        usersService.findUserByIdenfitier.mockResolvedValue(Ok(userMapper.toPersistence(user)));
        ipLocatorService.getLocation.mockResolvedValue('Germany (GER) / Berlin (Brl)');
        deviceDetectorService.getDevice.mockReturnValue('Local Device');
        sessionsService.createSession.mockResolvedValue(Ok([tokens, session]));

        const result = await handler.execute(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.unwrap()).toBeInstanceOf(AuthenticationCredentialDto);
            expect(result.unwrap().userId).toEqual(user.id);
            expect(result.unwrap().tokens).toEqual({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        }

        expect(usersService.findUserByIdenfitier).toHaveBeenCalledWith({
            username: command.username,
            email: command.email,
        });
        expect(passwordService.comparePassword).toHaveBeenCalledWith(
            command.password,
            user.getProps().password
        );
    });

    it('should return an error if user is not found', async () => {
        const command = new SignInCommand({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            clientInfo: { ip: '127.0.0.1', userAgent: 'test-agent' },
        });

        usersService.findUserByIdenfitier.mockResolvedValue(Err(new InvalidAuthenticationCredentials()));

        const result = await handler.execute(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.unwrapErr()).toBeInstanceOf(InvalidAuthenticationCredentials);
        }
    });

    it('should return an error if password is invalid', async () => {
        const command = new SignInCommand({
            username: 'testuser',
            email: 'test@example.com',
            password: 'wrongpassword',
            clientInfo: { ip: '127.0.0.1', userAgent: 'test-agent' },
        });

        const user = UserEntity.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedPassword123',
        });

        usersService.findUserByIdenfitier.mockResolvedValue(Ok(userMapper.toPersistence(user)));
        passwordService.comparePassword.mockResolvedValue(false);

        const result = await handler.execute(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.unwrapErr()).toBeInstanceOf(InvalidAuthenticationCredentials);
        }
    });

    it('should handle session creation failure', async () => {
        const command = new SignInCommand({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            clientInfo: { ip: '127.0.0.1', userAgent: 'test-agent' },
        });

        const user = UserEntity.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedPassword123',
        });

        passwordService.comparePassword.mockResolvedValue(true);
        usersService.findUserByIdenfitier.mockResolvedValue(Ok(userMapper.toPersistence(user)));
        ipLocatorService.getLocation.mockResolvedValue('Test Location');
        deviceDetectorService.getDevice.mockReturnValue('Test Device');
        sessionsService.createSession.mockResolvedValue(Err(new SessionCreationFailedError()));

        const result = await handler.execute(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.unwrapErr()).toBeInstanceOf(SessionCreationFailedError);
        }
    });
});
