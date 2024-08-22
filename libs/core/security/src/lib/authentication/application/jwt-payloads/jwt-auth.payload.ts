import { AggregateID } from "@goran/common";

export interface JwtPayload {
	userId: AggregateID;
	issuedAt: number;
	expiration: number;
}

export type JwtPayloadSign = Omit<JwtPayload, "issuedAt" | "expiration">;
