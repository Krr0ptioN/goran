import { AggregateID, Optional, RequireOnlyOne } from '@goran/common';

export interface PlaylistProps {
    ownerId: AggregateID;
    name: string;
    description: Optional<string>;
    coverImageKey: Optional<string>;
    songIds: AggregateID[];
}

export interface CreatePlaylistProps {
    ownerId: AggregateID;
    description?: Optional<string>;
    coverImageKey?: Optional<string>;
    name: string;
    songIds?: AggregateID[];
}

export type UpdatePlaylistProps = RequireOnlyOne<CreatePlaylistProps>;
