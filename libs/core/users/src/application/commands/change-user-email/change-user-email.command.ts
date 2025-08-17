import { Command, CommandProps } from '@goran/common';
import { UserEntity } from '../../../domain';

export class ChangeUserEmailCommand extends Command {
    readonly newEmail: string;
    readonly user: UserEntity;

    constructor(props: CommandProps<ChangeUserEmailCommand>) {
        super(props);
        this.newEmail = props.newEmail;
        this.user = props.user;
    }
}
