import { SessionEntity } from '../../domain';

export abstract class SessionsRepository {
    abstract create(session: SessionEntity): Promise<SessionEntity>;
    abstract findByRefreshToken(token: string): Promise<SessionEntity | null>;
    abstract updateRefreshToken(
        oldToken: string,
        newToken: string
    ): Promise<void>;
    abstract deleteByRefreshToken(token: string): Promise<void>;
    abstract findByUserId(userId: string): Promise<SessionEntity[]>;
    abstract delete(sessionId: string): Promise<void>;
    abstract findAll(): Promise<SessionEntity[]>;
}
