import { RequireOnlyOne, AggregateID } from '@goran/common';

export interface GenreProps {
    ownerId: AggregateID;
    name: string;
}

export interface CreateGenreProps {
    ownerId: AggregateID;
    name: string;
}

export type UpdateGenreProps = RequireOnlyOne<CreateGenreProps>;
