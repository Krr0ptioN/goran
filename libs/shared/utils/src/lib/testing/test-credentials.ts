import { randomUUID } from 'node:crypto';

const compactUuid = () => randomUUID().replace(/-/g, '');

export const generateTestPassword = () => `Aa1!${compactUuid()}`;

export const generateTestEmail = (domain = 'example.com') =>
    `user-${compactUuid()}@${domain}`;

export const generateTestUsername = () => `user-${compactUuid().slice(0, 12)}`;
