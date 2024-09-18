import { TokenProps, TokenValueObject } from '../../../tokens';

export class AuthenticationCredentialDto {
    userId: string;
    tokens: TokenProps;

    constructor(props: { userId: string; tokens: TokenValueObject }) {
        this.userId = props.userId;
        this.tokens = props.tokens.unpack();
    }
}
