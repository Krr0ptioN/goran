import { AggregateID, Entity } from '@goran/common';
import { CreateAlbumProps, AlbumProps } from './album.types';
import { ulid } from 'ulid';

export class AlbumEntity extends Entity<AlbumProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateAlbumProps): AlbumEntity {
        const id = ulid();
        const props: AlbumProps = { ...create };
        const song = new AlbumEntity({ id, props });
        return song;
    }

    validate(): void {
        return;
    }
}
