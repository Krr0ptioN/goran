import { AggregateID, Entity } from '@goran/common';
import { CreateGenreProps, GenreProps } from './genre.types';
import { ulid } from 'ulid';

export class GenreEntity extends Entity<GenreProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateGenreProps): GenreEntity {
        const id = ulid();
        const props: GenreProps = { ...create };
        const song = new GenreEntity({ id, props });
        return song;
    }

    validate(): void {
        return;
    }
}
