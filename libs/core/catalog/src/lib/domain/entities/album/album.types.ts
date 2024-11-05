import { RequireOnlyOne, AggregateID } from '@goran/common';

export interface AlbumProps {
    producerIds: AggregateID[];
    releasedDate: Date;
    name: string;
}

export interface CreateAlbumProps {
    producerIds: AggregateID[];
    releasedDate: Date;
    name: string;
}

export type UpdateAlbumProps = RequireOnlyOne<CreateAlbumProps>;
