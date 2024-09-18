import { DynamicModule } from '@nestjs/common';
import { TokensModule } from '../tokens';
import {
    SessionsService,
    SessionTokenFactory,
    SessionMapper,
    SessionsWriteModelRepository,
    SessionsReadModelRepository,
} from './application';
import {
    SessionsReadModelRepositoryPostgres,
    SessionsWriteModelRepositoryPostgres,
} from './infrastructure';
import { RefreshTokenController } from './presenters/http/tokens';
import { JwtAuthGuard } from '../authentication';

export class SessionsModule {
    static register(options: { refreshIn: string }): DynamicModule {
        return {
            module: SessionsModule,
            global: true,
            providers: [
                {
                    provide: SessionsWriteModelRepository,
                    useClass: SessionsWriteModelRepositoryPostgres,
                },
                {
                    provide: SessionsReadModelRepository,
                    useClass: SessionsReadModelRepositoryPostgres,
                },
                SessionMapper,
                SessionsService,
                SessionTokenFactory,
                JwtAuthGuard,
                {
                    provide: 'REFRESH_IN',
                    useValue: options.refreshIn,
                },
            ],
            imports: [TokensModule],
            exports: [
                JwtAuthGuard,
                SessionMapper,
                SessionsService,
                SessionTokenFactory,
            ],
            controllers: [RefreshTokenController],
        };
    }
}
