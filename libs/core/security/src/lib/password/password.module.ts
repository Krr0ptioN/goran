import { Global, Module } from '@nestjs/common';
import { BcryptPasswordHasher } from './infrastructure';
import { PasswordService } from './application';
import { PasswordHasher } from './domain';

@Global()
@Module({
    providers: [
        PasswordService,
        {
            provide: PasswordHasher,
            useClass: BcryptPasswordHasher,
        },
    ],
    exports: [PasswordService],
})
export class PasswordModule { }
