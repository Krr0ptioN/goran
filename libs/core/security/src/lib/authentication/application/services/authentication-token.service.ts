import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError, TokenValueObject } from '../../domain';
import { UsersService } from '@goran/users';
import { CONFIG_APP } from '@goran/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AggregateID } from '@goran/common';
import { AuthenticationTokenFactory } from '../factories';

enum TokenState {
    REVOKED = 'REVOKED',
}

@Injectable()
export class AuthenticationTokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly authTokenFactory: AuthenticationTokenFactory,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    private readonly refreshIn = this.configService.get<number>(
        CONFIG_APP.SECURITY_REFRESH_IN
    );

    getUserFromToken(token: string) {
        const id = this.jwtService.decode(token)['userId'];
        const user = this.usersService.findOneById(id);
        return user;
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
        const revokedToken = await this.cacheManager.get(token);
        const isRevoken = revokedToken
            ? revokedToken === TokenState.REVOKED
            : false;
        return isRevoken;
    }

    async refreshAccessToken(
        userId: AggregateID,
        refreshToken: string
    ): Promise<TokenValueObject> {
        const isRefreshTokenValid = await this.verifyRefreshToken(refreshToken);
        if (!isRefreshTokenValid) {
            throw new InvalidTokenError('Invalid refresh token');
        }

        const isRefreshTokenRevoked = await this.isTokenRevoked(refreshToken);
        if (isRefreshTokenRevoked) {
            throw new InvalidTokenError('Invalid refresh provided');
        }

        return this.authTokenFactory.generateTokens({ userId });
    }

    async revokeToken(token: string) {
        await this.cacheManager.set(token, TokenState.REVOKED, this.refreshIn);
    }
}
