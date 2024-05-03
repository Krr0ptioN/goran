import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationPasswordController } from './password.controller';
import { AuthenticationPasswordService } from '../services';
import { UsersModule } from '@goran/users';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@goran/config';

describe('AuthenticationPasswordController', () => {
  let controller: AuthenticationPasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env', '.env.local'],
          validationSchema: configSchema,
        }),
        CacheModule.register({ isGlobal: true }),
      ],
      providers: [AuthenticationPasswordService],
      controllers: [AuthenticationPasswordController],
    }).compile();

    controller = module.get<AuthenticationPasswordController>(
      AuthenticationPasswordController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
