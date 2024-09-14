import { Module } from '@nestjs/common';
import { PasswordModule } from '../password/password.module';
import { PasswordResetSessionService } from './application';

@Module({
    imports: [PasswordModule],
    providers: [PasswordResetSessionService],
    exports: [PasswordResetSessionService],
})
export class PasswordResetModule { }
