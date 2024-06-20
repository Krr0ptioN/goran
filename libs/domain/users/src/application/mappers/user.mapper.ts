import { Mapper } from '@goran/common';
import { UserModel, userSchema, UserEntity } from '@goran/users';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper implements Mapper<UserEntity, UserModel> {
  toPersistence(entity: UserEntity): UserModel {
    const copy = entity.getProps();
    const record: UserModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      email: copy.email,
      username: copy.username,
      fullname: copy.fullname,
      password: copy.password,
    };
    return userSchema.parse(record);
  }

  toDomain(record: UserModel): UserEntity {
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
