import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError, TokenValueObject } from '../../../domain';
import { UsersService } from '@goran/users';
import { CONFIG_APP } from '@goran/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AggregateID } from '@goran/common';
import { JwtPayloadSign } from '../../../domain/strategy/jwt-payload.interface';

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
    ) { }

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

    generateTokens(payload: JwtPayloadSign): TokenValueObject {
        this.logger.verbose(
            `Generated access and refresh token for ${payload.userId} user`
        );
        return new TokenValueObject({
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        });
    }

    private generateAccessToken(payload: JwtPayloadSign): string {
        return this.jwtService.sign(payload, { secret: this.refreshSecretKey });
    }

    private generateRefreshToken(payload: JwtPayloadSign): string {
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

    async refreshAccessToken(userId: AggregateID, refreshToken: string): Promise<TokenValueObject> {
        const isRefreshTokenValid = await this.verifyRefreshToken(refreshToken);
        if (!isRefreshTokenValid) {
            throw new InvalidTokenError('Invalid refresh token');
        }

        const isRefreshTokenRevoked = await this.isTokenRevoked(refreshToken);
        if (isRefreshTokenRevoked) {
            throw new InvalidTokenError('Invalid refresh provided');
        }

        return this.generateTokens({ userId });
    }

    async revokeToken(token: string) {
        await this.cacheManager.set(token, TokenState.REVOKED, this.refreshIn);
    }
}
