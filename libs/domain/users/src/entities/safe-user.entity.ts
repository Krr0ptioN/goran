import { UserEntity, UserEntityInfo } from './user.entity';
import { Exclude } from 'class-transformer';

export class SafeUserEntityInfo implements UserEntityInfo {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    fullname: string | null;
    username: string;
    email: string;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
