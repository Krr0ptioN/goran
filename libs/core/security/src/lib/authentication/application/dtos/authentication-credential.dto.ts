import { TokenValueObject } from "../../domain";
import { UserEntity } from "@goran/users";

export class AuthenticationCredentialDto {
    userId: string;
    tokens: TokenValueObject;

    constructor(props: { user: UserEntity, tokens: TokenValueObject }) {
        this.userId = props.user.id;
        this.tokens = props.tokens;
    }
}
