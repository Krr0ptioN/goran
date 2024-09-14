import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '@goran/users';
import { TokensService } from './application/tokens.service';
import { CONFIG_APP } from '@goran/config';
import { CacheModule } from '@nestjs/cache-manager';
import { InMemoryCacheAdapter } from './infrastructure/cache/in-memory-cache.adapter';
import { CacheManagerPort } from './application/ports';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>(CONFIG_APP.JWT_ACCESS_SECRET),
                signOptions: {
                    expiresIn: configService.get<string>(
                        CONFIG_APP.SECURITY_EXPIRES_IN
                    ),
                },
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        CacheModule.register(),
    ],
    providers: [
        TokensService,
        {
            provide: CacheManagerPort,
            useClass: InMemoryCacheAdapter,
        },
        {
            provide: 'REFRESH_IN',
            useFactory: (configService: ConfigService) =>
                configService.get<number>(CONFIG_APP.SECURITY_REFRESH_IN) ??
                3600,
            inject: [ConfigService],
        },
    ],
    exports: [TokensService],
})
export class TokensModule {}
