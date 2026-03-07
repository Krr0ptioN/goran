import { AggregateID, Entity } from '@goran/common';
import { CreateAlbumProps, AlbumProps } from './album.types';
import { ulid } from 'ulid';

export class AlbumEntity extends Entity<AlbumProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateAlbumProps): AlbumEntity {
        const id = ulid();
        const props: AlbumProps = {
            name: create.name,
            coverImageKey: create.coverImageKey ?? null,
            releasedDate: create.releasedDate ?? null,
            producerIds: create.producerIds ?? [],
            songIds: create.songIds ?? [],
        };
        const song = new AlbumEntity({ id, props });
        return song;
    }

    validate(): void {
        return;
    }
}
