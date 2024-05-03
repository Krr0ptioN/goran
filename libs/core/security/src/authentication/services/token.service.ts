import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError } from '../errors';
import { Token } from '../entities';
import { UserEntity, UsersService } from '@goran/users';
import { CONFIG_APP } from '@goran/config';

@Injectable()
export class AuthenticationTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {}

  private readonly refreshSecretKey = this.configService.get<string>(
    CONFIG_APP.JWT_REFRESH_SECRET
  );
  private readonly refreshIn = this.configService.get<string>(
    CONFIG_APP.SECURITY_REFRESH_IN
  );

  private readonly logger = new Logger(AuthenticationTokenService.name);

  getUserFromToken(token: string) {
    const id = this.jwtService.decode(token)['userId'];
    const res = this.usersService.findOne({ id });
    return res;
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, { secret: this.refreshSecretKey });
  }

  private generateRefreshToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshSecretKey,
      expiresIn: this.refreshIn,
    });
  }

  private async verifyRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const decodedRefreshToken = this.jwtService.decode(refreshToken);
      return !!decodedRefreshToken;
    } catch (error) {
      return false;
    }
  }

  // TODO:
  private async isRefreshTokenRevoked(refreshToken: string): Promise<boolean> {
    // const revokedToken = await this.prisma.revokedToken.findUnique({
    //   where: {
    //     token: refreshToken,
    //   },
    // });
    return !!refreshToken;
  }

  // TODO:
  async isTokenRevoked(token: string, userId: number): Promise<boolean> {
    // const revokedToken = await this.prisma.revokedToken.findFirst({
    //   where: {
    //     token: token,
    //     userId: userId,
    //   },
    // });
    return !!(token + userId);
  }

  async refreshToken(user: UserEntity, refreshToken: string): Promise<Token> {
    const isRefreshTokenValid = await this.verifyRefreshToken(refreshToken);
    if (!isRefreshTokenValid) {
      throw new InvalidTokenError('Invalid refresh token');
    }

    const isRefreshTokenRevoked = await this.isRefreshTokenRevoked(
      refreshToken
    );
    if (isRefreshTokenRevoked) {
      throw new InvalidTokenError('Invalid refresh provided');
    }

    return this.generateTokens({ userId: user.id });
  }

  async revokeToken(token: string) {
    token;
  }
}
