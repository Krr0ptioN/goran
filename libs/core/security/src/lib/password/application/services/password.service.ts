import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '../../domain/password-hasher.interface';

/**
 * @class PasswordService
 *
 */
@Injectable()
export class PasswordService {
    constructor(
        private readonly passwordHasher: PasswordHasher,
    ) {}

    async hashPassword(password: string): Promise<string> {
        return this.passwordHasher.hash(password);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return this.passwordHasher.compare(password, hash);
    }
}
