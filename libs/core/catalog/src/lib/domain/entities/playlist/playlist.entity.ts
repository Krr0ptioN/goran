import { AggregateID, Entity } from '@goran/common';
import { CreatePlaylistProps, PlaylistProps } from './playlist.types';
import { ulid } from 'ulid';

export class PlaylistEntity extends Entity<PlaylistProps> {
    protected readonly _id: AggregateID;

    static create(create: CreatePlaylistProps): PlaylistEntity {
        const id = ulid();
        const props: PlaylistProps = { ...create };
        const song = new PlaylistEntity({ id, props });
        return song;
    }

    validate(): void {
        return;
    }
}
