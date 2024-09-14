import { Module } from '@nestjs/common';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher';
import { PasswordService } from './application/services/password.service';
import { PasswordHasher } from './domain/password-hasher.interface';

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
export class PasswordModule {}
