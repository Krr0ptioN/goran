import { AggregateRoot, AggregateID } from '@goran/common';
import { CreateSessionProps, SessionProps } from './session.type';
import { ulid } from 'ulid';
import { addDays } from 'date-fns';

export class SessionEntity extends AggregateRoot<SessionProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateSessionProps): SessionEntity {
        const id = ulid();
        const props: SessionProps = {
            ...create,
            status: 'active',
            expire: addDays(new Date(), 30),
        };
        return new SessionEntity({
            id,
            props,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    terminate(): void {}

    validate(): void {
        return;
    }
}
