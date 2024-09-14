import { ArgumentInvalidException, Guard, ValueObject } from '@goran/common';

export interface PasswordResetTokenProps {
    resetToken: string;
}

export class PasswordResetTokenVO extends ValueObject<PasswordResetTokenProps> {
    get resetToken() {
        return this.props.resetToken;
    }

    protected override validate(props: PasswordResetTokenProps): void {
        if (Guard.isEmpty(props.resetToken))
            throw new ArgumentInvalidException(
                'Neither access token and refresh token can be empty'
            );
    }
}
