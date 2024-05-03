import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import {
  AuthenticationPasswordService,
  AuthenticationService,
  AuthenticationTokenService,
} from '../services';
import { UsersModule } from '@goran/users';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({ global: true }),
        CacheModule.register({ isGlobal: true }),
      ],
      providers: [
        AuthenticationService,
        AuthenticationTokenService,
        AuthenticationPasswordService,
      ],
      controllers: [AuthenticationController],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
