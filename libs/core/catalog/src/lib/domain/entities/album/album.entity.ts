import { AggregateID, Entity } from '@goran/common';
import { CreateSongProps, SongProps } from './album.types';
import { ulid } from 'ulid';

export class SongEntity extends Entity<SongProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateSongProps): SongEntity {
        const id = ulid();
        const props: SongProps = { ...create };
        const song = new SongEntity({ id, props });
        return song;
    }

    validate(): void {
        return;
    }
}
