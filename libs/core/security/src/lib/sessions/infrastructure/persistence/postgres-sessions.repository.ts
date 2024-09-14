import { Injectable } from '@nestjs/common';
import { SessionsRepository, SessionMapper } from '../../application';
import { SessionEntity } from '../../domain';
import { eq } from 'drizzle-orm';
import { SessionModel } from '../../application/sessions.model';
import { 
    SessionsDataPgTable as SessionsTable,
    DrizzleService
} from '@goran/drizzle-data-access';

@Injectable()
export class PostgresSessionsRepository implements SessionsRepository {
    constructor(
        private readonly drizzleService: DrizzleService,
        private readonly sessionMapper: SessionMapper
    ) {}

    async create(session: SessionEntity): Promise<SessionEntity> {
        const persistenceModel = this.sessionMapper.toPersistence(session);
        const [created] = await this.drizzleService.db
            .insert(SessionsTable)
            .values(persistenceModel)
            .returning();
        return this.sessionMapper.toDomain(created);
    }

    async findByRefreshToken(token: string): Promise<SessionEntity | null> {
        const [session] = await this.drizzleService.db
            .select()
            .from(SessionsTable)
            .where(eq(SessionsTable.refreshToken, token));
        return session ? this.sessionMapper.toDomain(session) : null;
    }

    async updateRefreshToken(oldToken: string, newToken: string): Promise<void> {
        await this.drizzleService.db
            .update(SessionsTable)
            .set({ refreshToken: newToken })
            .where(eq(SessionsTable.refreshToken, oldToken));
    }

    async deleteByRefreshToken(token: string): Promise<void> {
        await this.drizzleService.db
            .delete(SessionsTable)
            .where(eq(SessionsTable.refreshToken, token));
    }

    async findByUserId(userId: string): Promise<SessionEntity[]> {
        const sessionsModel = await this.drizzleService.db
            .select()
            .from(SessionsTable)
            .where(eq(SessionsTable.userId, userId));
        const sessions = await Promise.all(sessionsModel.map(session => this.sessionMapper.toDomain(session)));
        return sessions;
    }

    async delete(sessionId: string): Promise<void> {
        await this.drizzleService.db
            .delete(SessionsTable)
            .where(eq(SessionsTable.id, sessionId));
    }

    async findAll(): Promise<SessionModel[]> {
        return await this.drizzleService.db
            .select()
            .from(SessionsTable);
    }
}