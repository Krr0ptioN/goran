import { Command, CommandProps } from '@goran/common';
import { UserEntity } from '@goran/users';

export class ChangeUserUsernameCommand extends Command {
    readonly user: UserEntity;
    readonly newUsername: string;

    constructor(props: CommandProps<ChangeUserUsernameCommand>) {
        super(props);
        this.newUsername = props.newUsername;
        this.user = props.user;
    }
}
