import { Injectable } from '@nestjs/common';
import { PasswordForResetPasswordDto, ResetPasswordDto } from '../dto';
import { randomBytes } from 'crypto';
import { InvalidPasswordResetRequest, InvalidTokenError } from '../errors';
import { UsersService } from '@goran/users';

@Injectable()
export class AuthenticationPasswordServiceMock {
  constructor(private usersService: UsersService) {}

  private expireDuration = 10000;
  private saltOrRounds = 'RANDOM_STRING_AS_SALT';
  passwordResetAttempts: Map<string, number>;

  get bcryptSaltRounds() {
    return this.saltOrRounds;
  }

  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return password === hashedPassword;
  }

  async hashPassword(password: string): Promise<string> {
    return password + '-' + this.saltOrRounds;
  }

  private generateResetPasswordToken() {
    return randomBytes(32).toString('hex');
  }

  async changeForgotPassword(
    newPasswordReq: PasswordForResetPasswordDto,
    userId: number
  ) {
    const hashedPassword = await this.hashPassword(newPasswordReq.newPassword);
    return this.usersService.changePassword(hashedPassword, { id: userId });
  }

  async requestResetPassword(body: ResetPasswordDto) {
    const token = this.generateResetPasswordToken();
    const user = await this.usersService.findOne({ email: body.email });

    if (user) {
      this.passwordResetAttempts.set(token, user.id);
      return {
        expiresIn: this.expireDuration,
        message: `Please checkout your verification link token on your ${body.email} email `,
      };
    } else {
      throw new InvalidPasswordResetRequest('User were not found');
    }
  }
  async verifyPasswordResetAttempt(
    credentials: PasswordForResetPasswordDto,
    token: string
  ) {
    const userId: number | undefined = this.passwordResetAttempts.get(token);
    if (userId) {
      this.changeForgotPassword(credentials, userId);
      Object;
      return {
        message: 'Your password have been reseted successfully',
      };
    } else {
      throw new InvalidTokenError('Invalid or expired token provided.');
    }
  }
}
