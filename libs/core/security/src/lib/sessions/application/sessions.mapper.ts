import { Mapper } from '@goran/common';
import { SessionEntity } from '../domain/entities/session/session.entity';
import { SessionModel } from './sessions.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionMapper implements Mapper<SessionEntity, SessionModel> {
    toPersistence(entity: SessionEntity): SessionModel {
        const props = entity.getProps();
        return {
            id: props.id,
            userId: props.userId,
            refreshToken: props.refreshToken,
            ip: props.ip,
            location: props.location ?? null,
            device: props.device ?? null,
            status: props.status,
            expire: props.expire,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
        };
    }

    async toDomain(record: SessionModel): Promise<SessionEntity> {
        const entity = new SessionEntity({
            id: record.id,
            createdAt: new Date(record.createdAt),
            updatedAt: new Date(record.updatedAt),
            props: {
                userId: record.userId,
                refreshToken: record.refreshToken,
                ip: record.ip,
                location: record.location ?? undefined,
                device: record.device ?? undefined,
                status: record.status,
                expire: new Date(record.expire),
            },
        });
        return entity;
    }
}
