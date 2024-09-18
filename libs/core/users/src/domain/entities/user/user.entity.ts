import { AggregateRoot, AggregateID } from '@goran/common';
import { UserDeletedDomainEvent, UserCreatedDomainEvent } from '../../events';
import { CreateUserProps, UserProps } from './user.types';
import { ulid } from 'ulid';

export class UserEntity extends AggregateRoot<UserProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateUserProps): UserEntity {
        const id = ulid();
        const props: UserProps = { ...create };
        const user = new UserEntity({ id, props });
        user.addEvent(
            new UserCreatedDomainEvent({
                aggregateId: id,
                email: props.email,
                username: props.username,
                fullname: props.fullname,
            })
        );
        return user;
    }

    delete(): void {
        this.addEvent(
            new UserDeletedDomainEvent({
                aggregateId: this.id,
            })
        );
    }

    validate(): void {
        return;
    }
}
