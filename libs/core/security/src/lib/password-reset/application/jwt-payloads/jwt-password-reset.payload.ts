export interface JwtPasswordResetPayload {
    email: string;
    issuedAt: number;
    expiration: number;
}

export type JwtPasswordResetPayloadSign = Omit<JwtPasswordResetPayload, "issuedAt" | "expiration">;
