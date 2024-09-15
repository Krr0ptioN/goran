import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@goran/users';
import {
    SessionsReadModelRepository,
    SessionsWriteModelRepository,
} from '../ports';
import { SessionEntity, SessionStatus } from '../../domain';
import { UserEntity } from '@goran/users';
import { SessionTokenFactory } from '../factories';
import {
    InvalidTokenError,
    TokensService,
    TokenValueObject,
} from '../../../tokens';
import { AggregateID, ExceptionBase, Optional } from '@goran/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { None, Ok, Option, Result, Err, match } from 'oxide.ts';
import { SessionModel } from '../sessions.model';
import {
    SessionNotFoundError,
    SessionRevokeFailedError,
} from '../../domain/errors';
import { SessionRevokedError } from '../../domain/errors/session-revoked.error';

@Injectable()
export class SessionsService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly sessionsReadRepository: SessionsReadModelRepository,
        private readonly sessionsWriteRepository: SessionsWriteModelRepository,
        private readonly sessionTokenFactory: SessionTokenFactory,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject('REFRESH_IN') private readonly refreshIn: number,
        private readonly tokensService: TokensService
    ) { }

    async createSession(
        user: UserEntity,
        ip: string,
        location?: Optional<string>,
        device?: Optional<string>
    ): Promise<Result<[TokenValueObject, SessionEntity], ExceptionBase>> {
        const tokens = this.sessionTokenFactory.generateTokens({
            userId: user.id,
        });
        const session = SessionEntity.create({
            userId: user.id,
            location,
            device,
            ip,
            refreshToken: tokens.refreshToken,
        });

        const createResult = await this.sessionsWriteRepository.create(session);

        return match(createResult, {
            Ok: () => Ok([tokens, session]),
            Err: (err) =>
                Err(err) as Result<
                    [TokenValueObject, SessionEntity],
                    ExceptionBase
                >,
        });
    }

    /**
     * @description Refresh token validation
     * @param token - Refresh token
     */
    async validateRefreshToken(token: string): Promise<Option<UserEntity>> {
        try {
            const payload = this.jwtService.verify(token);
            const session =
                await this.sessionsReadRepository.findByRefreshToken(token);
            if (!session) throw new UnauthorizedException('Invalid session');
            return await this.usersService.findOneByIdDomain(payload.userId);
        } catch (e) {
            return None;
        }
    }

    async isRefreshTokenRevoked(
        token: string
    ): Promise<Result<boolean, ExceptionBase>> {
        const revokedToken: SessionStatus | undefined =
            await this.cacheManager.get(token);

        if (revokedToken === 'revoked') return Ok(true);

        const sessionOption =
            await this.sessionsReadRepository.findByRefreshToken(token);

        if (sessionOption.isNone()) return Err(new SessionNotFoundError());
        if (sessionOption.unwrap().status === 'revoked') return Ok(true);

        return Ok(false);
    }

    async refreshAccessTokenForSession(
        userId: AggregateID,
        refreshToken: string
    ): Promise<Result<TokenValueObject, ExceptionBase>> {
        const isRefreshTokenValid =
            await this.tokensService.refreshTokenIsValid(refreshToken);

        if (!isRefreshTokenValid) {
            return Err(new InvalidTokenError());
        }
        const isRevoked = await this.isRefreshTokenRevoked(refreshToken);

        return match(isRevoked, {
            Err: (err) => Err(err) as Result<TokenValueObject, ExceptionBase>,
            Ok: (result) =>
                result
                    ? Err(new SessionRevokedError())
                    : Ok(
                        this.sessionTokenFactory.generateAccessTokenForRefreshToken(
                            refreshToken,
                            { userId }
                        )
                    ),
        });
    }

    async revokeSession(
        refreshToken: string
    ): Promise<Result<SessionEntity, ExceptionBase>> {
        try {
            await this.cacheManager.set(
                refreshToken,
                'revoked',
                this.refreshIn
            );
            return await this.sessionsWriteRepository.revokeByRefreshToken(
                refreshToken
            );
        } catch (error) {
            return Err(new SessionRevokeFailedError());
        }
    }

    async getActiveSessionsForUser(userId: string): Promise<SessionModel[]> {
        return await this.sessionsReadRepository.findActiveSessionsByUserId(
            userId
        );
    }

    async deleteSession(sessionId: string): Promise<void> {
        await this.sessionsWriteRepository.delete(sessionId);
    }

    async getSessionByToken(token: string): Promise<Option<SessionModel>> {
        return await this.sessionsReadRepository.findByRefreshToken(token);
    }
}
