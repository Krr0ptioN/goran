import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '../services/mail.service';
import { MailProviderToken } from '../providers/mail-provider.interface';
import { ConfigService } from '@nestjs/config';
import { CONFIG_APP } from '@goran/config';
import { ResendModule } from 'nestjs-resend';
import { ResendMailProvider } from '../providers/resend.provider';

@Module({
  imports: [
    ConfigModule,
    ResendModule.forAsyncRoot({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>(
          CONFIG_APP.RESEND_GORAN_API,
          'NOT_PROVIDED'
        ),
      }),
    }),
  ],
  providers: [
    MailService,
    ResendMailProvider,
    {
      provide: MailProviderToken,
      inject: [ConfigService, ResendMailProvider],
      useFactory: (config: ConfigService, resend: ResendMailProvider) => {
        return config.get<string>(CONFIG_APP.MAIL_INFRASTRUCTURE) === 'RESEND'
          ? resend
          : null;
      },
    },
  ],
  exports: [MailService],
})
export class MailModule { }
