import { Command, CommandProps } from '@goran/common';

/**
 * Verify Password Reset Attempt command
 *
 * @param otpcode New password
 * @param email User's email
 */
export class VerifyPasswordResetAttemptCommand extends Command {
    readonly email: string;
    readonly otpcode: string;

    constructor(props: CommandProps<VerifyPasswordResetAttemptCommand>) {
        super(props);
        this.otpcode = props.otpcode;
        this.email = props.email;
    }
}
