import { RequireOnlyOne, AggregateID } from '@goran/common';

export interface SongProps {
    name: string;
    procducerIds: AggregateID[];
    album: AggregateID;
    password: string;
}

export interface CreateUserProps {
    email: string;
    username: string;
    fullname?: string | null;
    password: string;
}

export type UpdateUserProps = RequireOnlyOne<CreateUserProps>;
