import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetController } from './password-reset.controller';
import { PasswordService } from '../../../application/services';
import { UsersModule } from '@goran/users';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from '@goran/config';
import { MailModule } from '@goran/mail';

describe('AuthenticationPasswordController', () => {
    let controller: PasswordResetController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                UsersModule,
                MailModule,
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ['.env', '.env.local'],
                    validationSchema: configSchema,
                }),
                CacheModule.register({ isGlobal: true }),
            ],
            providers: [PasswordService],
            controllers: [PasswordResetController],
        }).compile();

        controller = module.get<PasswordResetController>(
            PasswordResetController
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
