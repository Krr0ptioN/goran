import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationTokenController } from './authentication-token.controller';
import { AuthenticationTokenService } from '../services/token.service';
import { UsersModule } from '@goran/users';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

describe('AuthenticationTokenController', () => {
  let controller: AuthenticationTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({ global: true }),
        CacheModule.register({ isGlobal: true }),
      ],
      controllers: [AuthenticationTokenController],
      providers: [AuthenticationTokenService],
    }).compile();

    controller = module.get<AuthenticationTokenController>(
      AuthenticationTokenController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
