import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from '../../../presenters/http/password/reset-password.dto';
import { randomBytes } from 'crypto';
import { compare, genSaltSync, hashSync } from 'bcrypt';
import { InvalidPasswordResetRequest } from '../../../domain/errors';
import { UsersService } from '@goran/users';
import { CONFIG_APP } from '@goran/config';
import { MailService } from '@goran/mail';

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
    private readonly mailService: MailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {
    this.expireDuration = this.configService.get<number>(
      CONFIG_APP.SECURITY_EXPIRES_IN,
      10000
    ) as number;
    this.serverPasswordResetURL = this.configService.get<string>(
      CONFIG_APP.SERVER_PASSWORD_RESET_URL
    ) as string;
  }

  // Expire duration for password reset request in milliseconds
  private expireDuration: number;
  private saltOrRounds = 10;
  private serverPasswordResetURL: string;

  private getConfirmationUrl(token: string) {
    return `${this.serverPasswordResetURL}/${token}`;
  }

  get bcryptSaltRounds() {
    return this.saltOrRounds;
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  hashPassword(password: string): string {
    const salt = genSaltSync(this.saltOrRounds);
    return hashSync(password, salt);
  }

  private generateResetPasswordToken() {
    return randomBytes(32).toString('hex');
  }

  async changeForgotPassword(credential: ResetPasswordDto, userId: string) {
    const hashedPassword = this.hashPassword(credential.password);
    const user = await this.usersService.findOneById(userId);
    return this.usersService.changePassword(user, hashedPassword);
  }

  async requestResetPassword(body: ResetPasswordDto) {
    const token = this.generateResetPasswordToken();
    const user = await this.usersService.findOneByEmail(body.email);

    if (user) {
      await this.cacheManager.set(token, user.id, this.expireDuration);
      this.mailService.send({
        from: 'goran@mardin.cc',
        to: user.email,
        subject: 'Password Reset Confirmation',
        text: this.getConfirmationUrl(token),
      });
      return {
        expiresIn: this.expireDuration,
        message: `Please checkout your verification link token on your ${body.email} email `,
      };
    } else {
      throw new InvalidPasswordResetRequest('User were not found');
    }
  }

  /**
   * Verifies the password reset attempt and change
   * the forgotten password to the new provided password.
   * @param credentials - New password
   * @param token - user's token of the user that
   * attempted to reset its password.
   */
  async verifyPasswordResetAttempt() {
    return;
  }
}
