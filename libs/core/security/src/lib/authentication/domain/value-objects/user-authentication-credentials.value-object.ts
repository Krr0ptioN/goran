import { ArgumentInvalidException, Guard, ValueObject } from "@goran/common";
import { UserEntity } from "@goran/users";
import { TokenValueObject } from "../value-objects";

interface UserAuthenticationCredentialsProps {
    user: UserEntity;
    tokens: TokenValueObject;
}

export class UserAuthenticationCredentialsVO extends ValueObject<UserAuthenticationCredentialsProps> {
    readonly user: UserEntity;
    readonly tokens: TokenValueObject;

    constructor(props: UserAuthenticationCredentialsProps) {
        super(props);
        this.user = props.user;
        this.tokens = props.tokens;
    }

    protected override validate(props: UserAuthenticationCredentialsProps): void {
        if (Guard.isEmpty(props))
            throw new ArgumentInvalidException("User and tokens cannot be empty");
    }
}
