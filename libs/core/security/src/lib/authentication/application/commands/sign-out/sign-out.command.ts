import { Command, CommandProps } from '@goran/common';

/**
 * Sign Out - Revokes the user session permenantly
 *
 * @param userId
 * @param refreshToken
 */
export class SignOutCommand extends Command {
    readonly userId: string;
    readonly refreshToken: string;

    constructor(props: CommandProps<SignOutCommand>) {
        super(props);
        this.userId = props.userId;
        this.refreshToken = props.refreshToken;
    }
}
