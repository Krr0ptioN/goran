import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule, UsersService, UsersServiceMock } from '@goran/users';
import { AuthenticationTokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

describe('AuthenticationTokenService', () => {
  let service: AuthenticationTokenService;
  let usersService: UsersServiceMock;

  const payload = {
    email: 'hiwa@goran.com',
    password: '5trong@p4ssword#',
    username: 'hiwaamedi',
    fullname: 'Hiwa Amedi',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CacheModule.register({ isGlobal: true }),
        JwtModule,
        UsersModule,
        ConfigModule,
      ],
      providers: [AuthenticationTokenService],
    })
      .overrideProvider(UsersService)
      .useClass(UsersServiceMock)
      .compile();

    service = module.get<AuthenticationTokenService>(
      AuthenticationTokenService
    );
    usersService = module.get<UsersServiceMock>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should generate token validate whether refesh token is revoked', async () => {
    const createdUser = usersService.create(payload);
    const tokens = service.generateTokens({ userId: createdUser.id });
    const result = await service.isTokenRevoked(tokens.refreshToken);
    expect(result).toBeFalsy();
  });

  it('should revoke generated token and validate whether token is revoked', async () => {
    const createdUser = usersService.create(payload);
    const tokens = service.generateTokens({ userId: createdUser.id });
    await service.revokeToken(tokens.refreshToken);
    const result = await service.isTokenRevoked(tokens.refreshToken);
    expect(result).toBeTruthy();
  });
});
