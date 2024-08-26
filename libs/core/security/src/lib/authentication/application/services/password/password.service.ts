import { Injectable } from '@nestjs/common';
import { compare, genSaltSync, hashSync } from 'bcrypt';

/**
 * @class PasswordService
 *
 */
@Injectable()
export class PasswordService {
    private readonly saltOrRounds = 10;

    get bcryptSaltRounds() {
        return this.saltOrRounds;
    }

    /**
     * Validating correctness of the password with another password
     * @param password - Unhashed raw password
     * @param hashedPassword - Existing hashed password
     * @returns boolean - True if password is the same as hashed password
     */
    async validatePassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await compare(password, hashedPassword);
    }

    /**
     * @param password - Unhashed raw password
     * @returns hashed version of the password
     */
    hashPassword(password: string): string {
        const salt = genSaltSync(this.saltOrRounds);
        return hashSync(password, salt);
    }
}
