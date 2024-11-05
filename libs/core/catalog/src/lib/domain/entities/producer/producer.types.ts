import { RequireOnlyOne, AggregateID, Optional } from '@goran/common';

export interface ProducerProps {
    fullname: string;
    nickname: Optional<string>;
    bio: Optional<string>;
    genreIds: AggregateID[];
    songIds: AggregateID[];
    albumIds: AggregateID[];
}

export interface CreateProducerProps {
    fullname: string;
    nickname: Optional<string>;
    bio: Optional<string>;
    genreIds: AggregateID[];
    songIds: AggregateID[];
    albumIds: AggregateID[];
}

export type UpdateProducerProps = RequireOnlyOne<CreateProducerProps>;
