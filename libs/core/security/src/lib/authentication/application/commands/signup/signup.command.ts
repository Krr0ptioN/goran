import { Command, CommandProps, Optional } from '@goran/common';
import { ClientInfoDto } from '../../dtos';

/**
 * Signup - User Registration
 *
 * @param {Optional<string>} fullname
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {ClientInfoDto} clientInfo  @readonly
 */
export class SignupCommand extends Command {
    readonly email: string;
    readonly fullname: Optional<string>;
    readonly username: string;
    readonly password: string;
    readonly clientInfo: ClientInfoDto;

    constructor(props: CommandProps<SignupCommand>) {
        super(props);
        this.fullname = props.fullname;
        this.username = props.username;
        this.email = props.email;
        this.password = props.password;
        this.clientInfo = props.clientInfo;
    }
}
