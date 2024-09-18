import { Injectable } from '@nestjs/common';
import { SessionsWriteModelRepository, SessionMapper } from '../../application';
import { SessionEntity } from '../../domain';
import { eq } from 'drizzle-orm';
import {
    SessionsDataPgTable as SessionsTable,
    DrizzleService,
} from '@goran/drizzle-data-access';
import { ExceptionBase } from '@goran/common';
import { Err, Ok, Result } from 'oxide.ts';
import {
    SessionCreationFailedError,
    SessionNotFoundError,
    SessionRevokeFailedError,
} from '../../domain/errors';

@Injectable()
export class SessionsWriteModelRepositoryPostgres
    implements SessionsWriteModelRepository {
    constructor(
        private readonly drizzleService: DrizzleService,
        private readonly sessionMapper: SessionMapper
    ) { }

    async create(
        session: SessionEntity
    ): Promise<Result<SessionEntity, ExceptionBase>> {
        try {
            const persistenceModel = this.sessionMapper.toPersistence(session);
            const [created] = await this.drizzleService.db
                .insert(SessionsTable)
                .values({ ...persistenceModel })
                .returning();
            return Ok(await this.sessionMapper.toDomain(created));
        } catch (error) {
            return Err(new SessionCreationFailedError());
        }
    }

    async revokeByRefreshToken(
        token: string
    ): Promise<Result<SessionEntity, ExceptionBase>> {
        try {
            const [updatedSession] = await this.drizzleService.db
                .update(SessionsTable)
                .set({
                    status: 'revoked',
                    expire: new Date(),
                })
                .where(eq(SessionsTable.refreshToken, token))
                .returning();
            if (!updatedSession) {
                return Err(new SessionRevokeFailedError());
            }
            const sessionEntity = await this.sessionMapper.toDomain(
                updatedSession
            );
            return Ok(sessionEntity);
        } catch (error) {
            return Err(new SessionRevokeFailedError());
        }
    }

    async revokeSession(
        sessionId: string
    ): Promise<Result<SessionEntity, ExceptionBase>> {
        try {
            const [updatedSession] = await this.drizzleService.db
                .update(SessionsTable)
                .set({
                    status: 'revoked',
                    expire: new Date(),
                })
                .where(eq(SessionsTable.id, sessionId))
                .returning();
            if (!updatedSession) {
                return Err(new SessionRevokeFailedError());
            }
            const sessionEntity = await this.sessionMapper.toDomain(
                updatedSession
            );
            return Ok(sessionEntity);
        } catch (error) {
            return Err(new SessionRevokeFailedError());
        }
    }

    async deleteByRefreshToken(
        token: string
    ): Promise<Result<true, ExceptionBase>> {
        const result = await this.drizzleService.db
            .delete(SessionsTable)
            .where(eq(SessionsTable.refreshToken, token))
            .returning();
        if (result.length !== 0) return Ok(true);
        else return Err(new SessionNotFoundError());
    }

    async delete(sessionId: string): Promise<Result<true, ExceptionBase>> {
        const result = await this.drizzleService.db
            .delete(SessionsTable)
            .where(eq(SessionsTable.id, sessionId))
            .returning();
        if (result.length !== 0) return Ok(true);
        else return Err(new SessionNotFoundError());
    }
}
