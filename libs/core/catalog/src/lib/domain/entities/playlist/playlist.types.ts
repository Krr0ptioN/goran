import { RequireOnlyOne, AggregateID } from '@goran/common';

export interface PlaylistProps {
    ownerId: AggregateID;
    name: string;
    description: string;
    songIds: AggregateID[];
}

export interface CreatePlaylistProps {
    ownerId: AggregateID;
    description: string;
    name: string;
    songIds: AggregateID[];
}

export type UpdatePlaylistProps = RequireOnlyOne<CreatePlaylistProps>;
