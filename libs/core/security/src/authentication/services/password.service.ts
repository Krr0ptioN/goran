import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { PasswordForResetPasswordDto, ResetPasswordDto } from '../dto';
import { randomBytes } from 'crypto';
import { hash, compare } from 'bcrypt';
import { InvalidPasswordResetRequest, InvalidTokenError } from '../errors';
import { UsersService } from '@goran/users';
import { CONFIG_APP } from '@goran/config';

// NOTE: For Cache-manager v5, provide ttl in milliseconds not seconds

/**
 * @class AuthenticationPasswordService
 *
 * @param ConfigService - Salt rounds variable for encryption and
 * expiration duration for passsword reset request
 * @param UsersService - User entity mutation
 * @param Cache - Caching service for password reset request
 */
@Injectable()
export class AuthenticationPasswordService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {
    this.saltOrRounds = this.configService.get<string>(
      CONFIG_APP.SECURITY_BCRYPT_SALT
    ) as string;
    this.expireDuration = this.configService.get<number>(
      CONFIG_APP.SECURITY_EXPIRES_IN
    ) as number;
  }

  // Expire duration for password reset request in milliseconds
  private expireDuration: number;

  private saltOrRounds: string;

  get bcryptSaltRounds() {
    return this.saltOrRounds;
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, this.bcryptSaltRounds);
  }

  private generateResetPasswordToken = () => {
    return randomBytes(32).toString('hex');
  };

  async changeForgotPassword(
    newPasswordReq: PasswordForResetPasswordDto,
    userId: number
  ) {
    const hashedPassword = await this.hashPassword(newPasswordReq.newPassword);
    return this.usersService.changePassword(hashedPassword, { id: userId });
  }

  // TODO: Use mail service to create
  async requestResetPassword(body: ResetPasswordDto) {
    const token = this.generateResetPasswordToken();
    const user = await this.usersService.findOne({ email: body.email });

    if (user) {
      await this.cacheManager.set(token, user.id, this.expireDuration);
      return {
        expiresIn: this.expireDuration,
        message: `Please checkout your verification link token on your ${body.email} email `,
      };
    } else {
      throw new InvalidPasswordResetRequest('User were not found');
    }
  }

  async verifyPassword(input: PasswordForResetPasswordDto, token: string) {
    const userId: number | undefined = await this.cacheManager.get(token);
    if (userId) {
      this.changeForgotPassword(input, userId);
      this.cacheManager.del(token);
      return {
        message: 'Your password have been reseted successfully',
      };
    } else {
      throw new InvalidTokenError('Invalid or expired token provided.');
    }
  }
}
