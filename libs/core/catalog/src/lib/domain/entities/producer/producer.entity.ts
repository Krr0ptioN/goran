import { AggregateID, Entity } from '@goran/common';
import { CreateProducerProps, ProducerProps } from './producer.types';
import { ulid } from 'ulid';

export class ProducerEntity extends Entity<ProducerProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateProducerProps): ProducerEntity {
        const id = ulid();
        const props: ProducerProps = {
            fullname: create.fullname,
            nickname: create.nickname ?? null,
            bio: create.bio ?? null,
            genreIds: create.genreIds ?? [],
            songIds: create.songIds ?? [],
            albumIds: create.albumIds ?? [],
        };
        const song = new ProducerEntity({ id, props });
        return song;
    }

    validate(): void {
        return;
    }
}
