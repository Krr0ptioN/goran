import { RequireOnlyOne, AggregateID } from '@goran/common';

export interface SongProps {
    userId: AggregateID;
    producerIds: AggregateID[];
    albumId: AggregateID;
    mediaId: AggregateID;
    releasedDate: Date;
    title: string;
}

export interface CreateSongProps {
    userId: AggregateID;
    producerIds: AggregateID[];
    albumId: AggregateID;
    mediaId: string;
    releasedDate: Date;
    title: string;
}

export type UpdateSongProps = RequireOnlyOne<CreateSongProps>;
