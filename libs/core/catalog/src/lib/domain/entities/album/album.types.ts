import { AggregateID, Optional, RequireOnlyOne } from '@goran/common';

export interface AlbumProps {
    producerIds: AggregateID[];
    songIds: AggregateID[];
    releasedDate: Optional<Date>;
    coverImageKey: Optional<string>;
    name: string;
}

export interface CreateAlbumProps {
    producerIds?: AggregateID[];
    songIds?: AggregateID[];
    releasedDate?: Optional<Date>;
    coverImageKey?: Optional<string>;
    name: string;
}

export type UpdateAlbumProps = RequireOnlyOne<CreateAlbumProps>;
