import { AggregateID, Optional, RequireOnlyOne } from '@goran/common';

export interface SongProps {
    userId: AggregateID;
    producerIds: AggregateID[];
    genreIds: AggregateID[];
    albumId: Optional<AggregateID>;
    audioFileKey: Optional<string>;
    coverImageKey: Optional<string>;
    releasedDate: Optional<Date>;
    duration: number;
    title: string;
}

export interface CreateSongProps {
    userId: AggregateID;
    producerIds?: AggregateID[];
    genreIds?: AggregateID[];
    albumId?: Optional<AggregateID>;
    audioFileKey?: Optional<string>;
    coverImageKey?: Optional<string>;
    releasedDate?: Optional<Date>;
    duration: number;
    title: string;
}

export type UpdateSongProps = RequireOnlyOne<CreateSongProps>;
