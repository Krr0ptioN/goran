import { Command, CommandProps } from '@goran/common';
import { UserEntity } from '@goran/users';

export class DeleteUserCommand extends Command {
    readonly user: UserEntity;

    constructor(props: CommandProps<DeleteUserCommand>) {
        super(props);
        this.user = props.user;
    }
}
