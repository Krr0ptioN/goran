import { AggregateID, RequireOnlyOne, Optional } from '@goran/common';

type SessionStatus = 'active' | 'revoked';

export interface SessionProps {
    refreshToken: string;
    ip: string;
    device: Optional<string>;
    location: Optional<string>;
    status: SessionStatus;
    expire: Date;
    userId: AggregateID;
}

export interface CreateSessionProps {
    refreshToken: string;
    ip: string;
    device: Optional<string>;
    location: Optional<string>;
    userId: AggregateID;
}

export type UpdateUserProps = RequireOnlyOne<CreateSessionProps>;
