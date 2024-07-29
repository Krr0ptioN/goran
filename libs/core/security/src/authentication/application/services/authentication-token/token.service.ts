import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError, TokenValueObject } from '../../../domain';
import { UserEntity, UsersService } from '@goran/users';
import { CONFIG_APP } from '@goran/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserTokenSignature } from '../entities/token-signature.entity';

enum TokenState {
  REVOKED = 'REVOKED',
}

@Injectable()
export class AuthenticationTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  private readonly refreshSecretKey = this.configService.get<string>(
    CONFIG_APP.JWT_REFRESH_SECRET
  );
  private readonly refreshIn = this.configService.get<number>(
    CONFIG_APP.SECURITY_REFRESH_IN
  );

  private readonly logger = new Logger(AuthenticationTokenService.name);

  getUserFromToken(token: string) {
    const id = this.jwtService.decode(token)['userId'];
    const user = this.usersService.findOneById(id);
    return user;
  }

  generateTokens(payload: UserTokenSignature): TokenValueObject {
    this.logger.verbose(
      `Generated access and refresh token for ${payload.userId} user`
    );
    return new TokenValueObject({
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    });
  }

  private generateAccessToken(payload: UserTokenSignature): string {
    return this.jwtService.sign(payload, { secret: this.refreshSecretKey });
  }

  private generateRefreshToken(payload: UserTokenSignature): string {
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

  async isTokenRevoked(token: string): Promise<boolean> {
    const revokedToken: string | undefined = await this.cacheManager.get(token);
    const isRevoken = revokedToken
      ? revokedToken === TokenState.REVOKED
      : false;
    return isRevoken;
  }

  async refreshToken(user: UserEntity, refreshToken: string): Promise<Token> {
    const isRefreshTokenValid = await this.verifyRefreshToken(refreshToken);
    if (!isRefreshTokenValid) {
      throw new InvalidTokenError('Invalid refresh token');
    }

    const isRefreshTokenRevoked = await this.isTokenRevoked(refreshToken);
    if (isRefreshTokenRevoked) {
      throw new InvalidTokenError('Invalid refresh provided');
    }

    return this.generateTokens({ userId: user.id });
  }

  async revokeToken(token: string) {
    await this.cacheManager.set(token, TokenState.REVOKED, this.refreshIn);
  }
}
