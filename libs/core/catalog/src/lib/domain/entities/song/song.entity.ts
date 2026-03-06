import { AggregateID, Entity } from '@goran/common';
import { CreateSongProps, SongProps } from './song.types';
import { ulid } from 'ulid';

export class SongEntity extends Entity<SongProps> {
    protected readonly _id: AggregateID;

    static create(create: CreateSongProps): SongEntity {
        const id = ulid();
        const props: SongProps = {
            userId: create.userId,
            title: create.title,
            duration: create.duration,
            releasedDate: create.releasedDate ?? null,
            audioFileKey: create.audioFileKey ?? null,
            coverImageKey: create.coverImageKey ?? null,
            albumId: create.albumId ?? null,
            producerIds: create.producerIds ?? [],
            genreIds: create.genreIds ?? [],
        };
        const song = new SongEntity({ id, props });
        return song;
    }

    validate(): void {
        return;
    }
}
