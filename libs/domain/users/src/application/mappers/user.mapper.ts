import { Mapper } from '@goran/common';
import { UserEntity } from '../../domain/entities';
import { UserModel } from '../models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper implements Mapper<UserEntity, UserModel> {
    toPersistence(entity: UserEntity): UserModel {
        const props = entity.getProps();
        return {
            id: props.id,
            username: props.username,
            email: props.email,
            password: props.password,
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
            fullname: props.fullname ?? null,
        };
    }

    async toDomain(record: UserModel): Promise<UserEntity> {
        const entity = new UserEntity({
            id: record.id,
            createdAt: new Date(record.createdAt),
            updatedAt: new Date(record.updatedAt),
            props: {
                email: record.email,
                username: record.username,
                fullname: record.fullname,
                password: record.password,
            },
        });
        return entity;
    }
}
