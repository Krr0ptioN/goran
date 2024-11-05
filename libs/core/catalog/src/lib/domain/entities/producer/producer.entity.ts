import { AggregateID, Entity } from '@goran/common';
import { CreateProducerProps, ProducerProps } from './producer.types';
import { ulid } from 'ulid';

export class ProducerEntity extends Entity<ProducerProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateProducerProps): ProducerEntity {
        const id = ulid();
        const props: ProducerProps = { ...create };
        const song = new ProducerEntity({ id, props });
        return song;
    }

    validate(): void {
        return;
    }
}
