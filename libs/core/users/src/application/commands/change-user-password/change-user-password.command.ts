import { Command, CommandProps } from '@goran/common';
import { UserEntity } from '../../../domain';

export class ChangeUserPasswordCommand extends Command {
    readonly newHashedPassword: string;
    readonly user: UserEntity;

    constructor(props: CommandProps<ChangeUserPasswordCommand>) {
        super(props);
        this.newHashedPassword = props.newHashedPassword;
        this.user = props.user;
    }
}
