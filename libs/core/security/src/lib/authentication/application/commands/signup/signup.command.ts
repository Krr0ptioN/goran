import { Command, CommandProps } from '@goran/common';

/**
 * Signup - User Registration
 *
 * @param fullname
 * @param username
 * @param password
 * @param email
 */
export class SignupCommand extends Command {
  readonly email: string;
  readonly fullname?: string | null;
  readonly username: string;
  readonly password: string;

  constructor(props: CommandProps<SignupCommand>) {
    super(props);
    this.fullname = props.fullname;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
  }
}
