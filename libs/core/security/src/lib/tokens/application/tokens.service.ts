import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenError, TokenValueObject } from '../domain';
import { UsersService } from '@goran/users';
import { AggregateID } from '@goran/common';
import { Request } from 'express';
import { CacheManagerPort } from './ports';

enum TokenState {
    REVOKED = 'REVOKED',
}

@Injectable()
export class TokensService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        @Inject('CacheManagerPort')
        private readonly cacheManager: CacheManagerPort,
        @Inject('REFRESH_IN') private readonly refreshIn: number
    ) {}

    async getUserFromToken(token: string) {
        const id = this.jwtService.decode(token)['userId'];
        const user = await this.usersService.findOneById(id);
        return user;
    }

    async refreshTokenIsValid(refreshToken: string): Promise<boolean> {
        try {
            const decodedRefreshToken = await this.jwtService.verify(
                refreshToken
            );
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

    async revokeToken(token: string) {
        await this.cacheManager.set(token, TokenState.REVOKED, this.refreshIn);
    }

    extractTokenFromRequest(req: Request) {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token must be provided');
        }
        return token;
    }
}
