import { AggregateID, Optional } from '@goran/common';
import { z } from 'zod';

export const sessionSchema = z.object({
    id: z.string().ulid(),
    createdAt: z.preprocess((val: any) => new Date(val), z.date()),
    updatedAt: z.preprocess((val: any) => new Date(val), z.date()),
    userId: z.string().ulid(),
    refreshToken: z.string(),
    ip: z.string(),
    location: z.string().optional().nullable(),
    device: z.string().optional().nullable(),
    status: z.enum(['active', 'revoked']),
    expire: z.preprocess((val: any) => new Date(val), z.date()),
});

export type SessionModel = z.TypeOf<typeof sessionSchema>;
export type SessionDto = {
    userId: string;
    refreshToken: string;
    ip: string;
    location?: Optional<string>;
    device?: Optional<string>;
};
