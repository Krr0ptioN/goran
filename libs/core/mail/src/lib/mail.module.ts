import { Module, Type, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './application/services';

@Module({
    imports: [ConfigModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
    static withInfra(infraModule: Type | DynamicModule) {
        return {
            module: MailModule,
            imports: [infraModule],
        };
    }
}
