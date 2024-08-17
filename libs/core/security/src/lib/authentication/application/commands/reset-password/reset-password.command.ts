import { Command, CommandProps } from '@goran/common';

/**
 * Verify Password Reset Attempt command
 *
 * @param newPassword New password
 * @param passwordResetAttemptToken Token to identify which whom pasword is reseting
 */
export class ResetPasswordCommand extends Command {
    readonly passwordResetAttemptToken: string;
    readonly newPassword: string;

    constructor(props: CommandProps<ResetPasswordCommand>) {
        super(props);
        this.passwordResetAttemptToken = props.passwordResetAttemptToken;
        this.newPassword = props.newPassword;
    }
}
