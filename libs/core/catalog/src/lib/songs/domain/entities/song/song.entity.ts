import { AggregateRoot, AggregateID } from '@goran/common';
import { SongDeletedDomainEvent, SongCreatedDomainEvent } from '../../events';
import { CreateSongProps, SongProps } from './song.types';
import { ulid } from 'ulid';

export class SongEntity extends AggregateRoot<SongProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateSongProps): SongEntity {
        const id = ulid();
        const props: SongProps = { ...create };
        const user = new SongEntity({ id, props });
        user.addEvent(
            new SongCreatedDomainEvent({
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
            new SongDeletedDomainEvent({
                aggregateId: this.id,
            })
        );
    }

    validate(): void {
        return;
    }
}
