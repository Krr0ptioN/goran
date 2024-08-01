import { Command, CommandProps } from '@goran/common';

/**
 * Signup - User Registration
 *
 * @param fullname
 * @param username
 * @param password
 * @param email
 */
export class SigninCommand extends Command {
  readonly email?: string;
  readonly username?: string;
  readonly password: string;

  constructor(props: CommandProps<SigninCommand>) {
    super(props);
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
  }
}
