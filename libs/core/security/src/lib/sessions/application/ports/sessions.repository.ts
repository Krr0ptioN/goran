import { SessionEntity } from '../../domain';
import { SessionModel } from '../sessions.model';
import { ExceptionBase } from '@goran/common';
import { Result, Option } from 'oxide.ts';

export abstract class SessionsWriteModelRepository {
    abstract create(session: SessionEntity): Promise<Result<SessionEntity, ExceptionBase>>;

    abstract deleteByRefreshToken(token: string): Promise<Result<true, ExceptionBase>>;

    abstract revokeByRefreshToken(token: string): Promise<Result<SessionEntity, ExceptionBase>>;

    abstract delete(sessionId: string): Promise<Result<true, ExceptionBase>>;
}

export abstract class SessionsReadModelRepository {
    abstract findByRefreshToken(token: string): Promise<Option<SessionModel>>;
    abstract findByUserId(userId: string): Promise<SessionModel[]>;
    abstract findActiveSessionsByUserId(userId: string): Promise<SessionModel[]>
}