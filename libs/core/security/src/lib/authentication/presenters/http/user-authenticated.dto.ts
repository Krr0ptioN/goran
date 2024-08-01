import { TokenValueObject } from "../../domain/value-objects";
import { AggregateID } from "@goran/common";

export class UserAuthenticatedDto {
    userId: AggregateID;
    tokens: TokenValueObject;


    constructor({ userId, tokens }: {
        userId: AggregateID,
        tokens: TokenValueObject
    }) {
        this.userId = userId;
        this.tokens = tokens;
    }
}
