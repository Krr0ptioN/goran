import { RequireOnlyOne } from '@goran/common';

export interface UserProps {
    email: string;
    fullname?: string | null;
    username: string;
    password: string;
}

export interface CreateUserProps {
    email: string;
    username: string;
    fullname?: string | null;
    password: string;
}

export type UpdateUserProps = RequireOnlyOne<CreateUserProps>;
