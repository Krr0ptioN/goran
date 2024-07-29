import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './auth.service';
import { AuthenticationPasswordService } from './password.service';
import { AuthenticationPasswordServiceMock } from './password.service.mock';
import { UsersServiceMock, UsersModule, UsersService } from '@goran/users';
import { AuthenticationTokenService } from './token.service';
import { AuthenticationTokenServiceMock } from './token.service.mock';
import { BadRequestException } from '@nestjs/common';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userService: UsersServiceMock;

  const payload = {
    email: 'hiwa@goran.com',
    password: '5trong@p4ssword#',
    username: 'hiwaamedi',
    fullname: 'Hiwa Amedi',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        AuthenticationService,
        {
          provide: AuthenticationPasswordService,
          useClass: AuthenticationPasswordServiceMock,
        },
        {
          provide: AuthenticationTokenService,
          useClass: AuthenticationTokenServiceMock,
        },
      ],
    })
      .overrideProvider(UsersService)
      .useClass(UsersServiceMock)
      .compile();
    service = module.get<AuthenticationService>(AuthenticationService);
    userService = module.get<UsersServiceMock>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signup new user', async () => {
    const result = await service.signup(payload);
    expect(result).toBeDefined();
    expect(result.user.email).toEqual(payload.email);
    expect(result.user.username).toEqual(payload.username);
    expect(result.tokens.refreshToken).toBeDefined();
    expect(result.tokens.accessToken).toBeDefined();
  });

  it('should signin existing user with valid credentials', async () => {
    const result = userService.create(payload);
    if (result) {
      const signinResult = await service.signin({
        email: payload.email,
        password: payload.password,
      });
      expect(signinResult.tokens).toBeDefined();
      expect(signinResult.user.email).toEqual(result.email);
      expect(signinResult.user.username).toEqual(result.username);
    } else {
      throw new Error('Failed to create user and setup test env');
    }
  });

  it('should reject signin request for existing user with invalid credentials', async () => {
    const result = userService.create(payload);
    if (result) {
      const invalidCredentials = {
        email: payload.email,
        password: 'invalid-password',
      };
      await expect(service.signin(invalidCredentials)).rejects.toThrow(
        BadRequestException
      );
    } else {
      throw new Error('Failed to create user and setup test env');
    }
  });

  it('should reject signin request for existing user when neither email nor username is provided along password', async () => {
    const result = userService.create(payload);
    if (result) {
      const invalidCredentials = {
        password: payload.password,
      };
      await expect(service.signin(invalidCredentials)).rejects.toThrow(
        BadRequestException
      );
    } else {
      throw new Error('Failed to create user and setup test env');
    }
  });

  it('should validate provided credentials', async () => {
    const userCreateResult = userService.create(payload);
    if (userCreateResult) {
      const result = await service.validate(payload);

      expect(result).toMatchObject({
        id: userCreateResult.id,
        fullname: userCreateResult.fullname,
        email: userCreateResult.email,
        username: userCreateResult.username,
      });
    } else {
      throw new Error('Failed to create user and setup test env');
    }
  });
});
