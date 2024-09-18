import { Command, CommandProps } from '@goran/common';

/**
 * Create user command
 *
 * @param password Password (not hashed)
 * @param email Email
 * @param fullname Full Name
 * @param username Unique username
 */
export class CreateUserCommand extends Command {
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly fullname?: string | null;

    constructor(props: CommandProps<CreateUserCommand>) {
        super(props);
        this.email = props.email;
        this.username = props.username;
        this.password = props.password;
        this.fullname = props.fullname;
    }
}
