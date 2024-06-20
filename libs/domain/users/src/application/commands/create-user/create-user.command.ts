import { Command, CommandProps } from '@goran/common';

export class CreateUserCommand extends Command {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly fullname?: string;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.username = props.username;
    this.fullname = props.fullname;
  }
}
