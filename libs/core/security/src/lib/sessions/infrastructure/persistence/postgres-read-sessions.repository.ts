import { Injectable } from '@nestjs/common';
import { SessionsReadModelRepository} from '../../application';
import { and, eq } from 'drizzle-orm';
import { SessionModel } from '../../application';
import { 
    SessionsDataPgTable as SessionsTable,
    DrizzleService
} from '@goran/drizzle-data-access';
import { None, Some, Option } from 'oxide.ts';

@Injectable()
export class SessionsReadModelRepositoryPostgres implements SessionsReadModelRepository {
    constructor(
        private readonly drizzleService: DrizzleService,
    ) {}

    async findByRefreshToken(token: string): Promise<Option<SessionModel>> {
        const [session] = await this.drizzleService.db
            .select()
            .from(SessionsTable)
            .where(eq(SessionsTable.refreshToken, token));
        return session ? Some(session) : None;
    }

 
    async findByUserId(userId: string): Promise<SessionModel[]> {
        return await this.drizzleService.db
            .select()
            .from(SessionsTable)
            .where(eq(SessionsTable.userId, userId));
    }

    async findActiveSessionsByUserId(userId: string): Promise<SessionModel[]> {
        return await this.drizzleService.db
            .select()
            .from(SessionsTable)
            .where(
                and(
                    eq(SessionsTable.userId, userId),
                    eq(SessionsTable.status, "active")
                )
            );
    }
}