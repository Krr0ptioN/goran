import { Test } from '@nestjs/testing';
import { SignUpCommandHandler } from './sign-up.command-handler';
import { SignUpCommand } from './sign-up.command';
import {
    UserCreationFailedError,
    UserEntity,
    UsersService,
} from '@goran/users';
import {
    SessionCreationFailedError,
    SessionEntity,
    SessionsService,
} from '../../../../sessions';
import { PasswordService } from '../../../../password';
import { IpLocatorService } from '@goran/ip-locator';
import { DeviceDetectorService } from '@goran/device-detector';
import { Ok, Err } from 'oxide.ts';
import { AuthenticationCredentialDto } from '../../dtos';
import { TokenValueObject } from '../../../../tokens';
import { PinoLogger } from 'nestjs-pino';
import {
    generateTestPassword,
    generateTestEmail,
    generateTestUsername,
} from '@goran/utils';

const TEST_PASSWORD = generateTestPassword();
const MOCK_HASHED_PASSWORD = `hashed_${TEST_PASSWORD}`;
const WRONG_PASSWORD = generateTestPassword();
const TEST_EMAIL = generateTestEmail();
const TEST_USERNAME = generateTestUsername();

describe('SignUpCommandHandler', () => {
    let handler: SignUpCommandHandler;
    let usersService: jest.Mocked<UsersService>;
    let sessionsService: jest.Mocked<SessionsService>;
    let passwordService: jest.Mocked<PasswordService>;
    let ipLocatorService: jest.Mocked<IpLocatorService>;
    let deviceDetectorService: jest.Mocked<DeviceDetectorService>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                SignUpCommandHandler,
                {
                    provide: PinoLogger,
                    useValue: {
                        info: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
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
                        hashPassword: jest.fn(),
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
            ],
        }).compile();

        handler = module.get<SignUpCommandHandler>(SignUpCommandHandler);
        usersService = module.get(UsersService);
        sessionsService = module.get(SessionsService);
        passwordService = module.get(PasswordService);
        ipLocatorService = module.get(IpLocatorService);
        deviceDetectorService = module.get(DeviceDetectorService);
    });

    it('should successfully sign up a user', async () => {
        const command = new SignUpCommand({
            email: TEST_EMAIL,
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
            fullname: 'Test User',
            clientInfo: { ip: '127.0.0.1', userAgent: 'test-agent' },
        });

        const hashedPassword = MOCK_HASHED_PASSWORD;

        const user = UserEntity.create({
            username: command.username,
            password: hashedPassword,
            email: command.email,
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

        passwordService.hashPassword.mockResolvedValue(hashedPassword);
        usersService.create.mockResolvedValue(Ok(user));
        ipLocatorService.getLocation.mockResolvedValue('Test Location');
        deviceDetectorService.getDevice.mockReturnValue('Test Device');
        sessionsService.createSession.mockResolvedValue(Ok([tokens, session]));

        const result = await handler.execute(command);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.unwrap()).toBeInstanceOf(AuthenticationCredentialDto);
            expect(result.unwrap().userId).toEqual(user.id);
            expect(result.unwrap().tokens).toEqual({
                refreshToken: tokens.refreshToken,
                accessToken: tokens.accessToken,
            });
        }

        expect(passwordService.hashPassword).toHaveBeenCalledWith(
            command.password,
        );
        expect(usersService.create).toHaveBeenCalledWith({
            ...command,
            password: hashedPassword,
        });
        expect(ipLocatorService.getLocation).toHaveBeenCalledWith(
            command.clientInfo.ip,
        );
        expect(deviceDetectorService.getDevice).toHaveBeenCalledWith(
            command.clientInfo.userAgent,
        );
        expect(sessionsService.createSession).toHaveBeenCalledWith(
            user,
            command.clientInfo.ip,
            'Test Location',
            'Test Device',
        );
    });

    it('should return an error if user creation fails', async () => {
        const command = new SignUpCommand({
            email: TEST_EMAIL,
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
            fullname: 'Test User',
            clientInfo: { ip: '127.0.0.1', userAgent: 'test-agent' },
        });

        const error = new UserCreationFailedError();
        usersService.create.mockResolvedValue(Err(error));

        const result = await handler.execute(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.unwrapErr()).toBe(error);
        }
    });

    it('should handle empty IP address', async () => {
        const command = new SignUpCommand({
            email: TEST_EMAIL,
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
            fullname: 'Test User',
            clientInfo: { ip: '', userAgent: 'test-agent' },
        });

        const hashedPassword = MOCK_HASHED_PASSWORD;
        const user = { id: 'user-id', email: TEST_EMAIL };
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

        passwordService.hashPassword.mockResolvedValue(hashedPassword);
        usersService.create.mockResolvedValue(Ok(user));
        ipLocatorService.getLocation.mockResolvedValue('Unknown');
        deviceDetectorService.getDevice.mockReturnValue('Test Device');
        sessionsService.createSession.mockResolvedValue(Ok([tokens, session]));

        await handler.execute(command);

        expect(ipLocatorService.getLocation).toHaveBeenCalledWith('');
        expect(sessionsService.createSession).toHaveBeenCalledWith(
            user,
            '',
            'Unknown',
            'Test Device',
        );
    });

    it('should handle empty user agent', async () => {
        const command = new SignUpCommand({
            email: TEST_EMAIL,
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
            fullname: 'Test User',
            clientInfo: { ip: '127.0.0.1', userAgent: '' },
        });

        const hashedPassword = MOCK_HASHED_PASSWORD;
        const user = { id: 'user-id', email: TEST_EMAIL };
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

        passwordService.hashPassword.mockResolvedValue(hashedPassword);
        usersService.create.mockResolvedValue(Ok(user));
        ipLocatorService.getLocation.mockResolvedValue('Test Location');
        sessionsService.createSession.mockResolvedValue(Ok([tokens, session]));

        await handler.execute(command);

        expect(deviceDetectorService.getDevice).not.toHaveBeenCalled();
        expect(sessionsService.createSession).toHaveBeenCalledWith(
            user,
            '127.0.0.1',
            'Test Location',
            'Unknown',
        );
    });

    it('should handle session creation failure', async () => {
        const command = new SignUpCommand({
            email: TEST_EMAIL,
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
            fullname: 'Test User',
            clientInfo: { ip: '127.0.0.1', userAgent: 'test-agent' },
        });

        const hashedPassword = MOCK_HASHED_PASSWORD;
        const user = UserEntity.create({
            username: command.username,
            password: hashedPassword,
            email: command.email,
        });
        const error = new SessionCreationFailedError();

        passwordService.hashPassword.mockResolvedValue(hashedPassword);
        usersService.create.mockResolvedValue(Ok(user));
        ipLocatorService.getLocation.mockResolvedValue('Test Location');
        deviceDetectorService.getDevice.mockReturnValue('Test Device');
        sessionsService.createSession.mockResolvedValue(Err(error));

        const result = await handler.execute(command);

        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
            expect(result.unwrapErr()).toEqual(error);
        }
    });
});
