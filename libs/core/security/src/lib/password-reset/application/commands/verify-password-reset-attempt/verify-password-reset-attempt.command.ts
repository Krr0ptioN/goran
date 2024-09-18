import { Command, CommandProps } from '@goran/common';

/**
 * Verify Password Reset Attempt command
 *
 * @param otpcode New password
 * @param email User's email
 * @param token Password reset seession's token
 */
export class VerifyPasswordResetAttemptCommand extends Command {
    readonly email: string;
    readonly token: string;
    readonly otpcode: string;

    constructor(props: CommandProps<VerifyPasswordResetAttemptCommand>) {
        super(props);
        this.otpcode = props.otpcode;
        this.email = props.email;
        this.token = props.token;
    }
}
