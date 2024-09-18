import { Command, CommandProps, Optional } from '@goran/common';
import { ClientInfoDto } from '../../dtos';

/**
 * Signup - User Registration
 *
 * @param fullname
 * @param username
 * @param password
 * @param email
 */
export class SignInCommand extends Command {
    readonly email: Optional<string>;
    readonly username: Optional<string>;
    readonly password: string;
    readonly clientInfo: ClientInfoDto;

    constructor(props: CommandProps<SignInCommand>) {
        super(props);
        this.username = props.username;
        this.email = props.email;
        this.password = props.password;
    }
}
