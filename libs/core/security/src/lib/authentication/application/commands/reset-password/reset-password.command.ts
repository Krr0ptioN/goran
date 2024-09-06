import { Command, CommandProps } from '@goran/common';

/**
 * Changing the password to new password
 *
 * @param password New password
 * @param token Token to identify which whom pasword is reseting
 */
export class ResetPasswordCommand extends Command {
    readonly token: string;
    readonly password: string;

    constructor(props: CommandProps<ResetPasswordCommand>) {
        super(props);
        this.token = props.token;
        this.password = props.password;
    }
}
