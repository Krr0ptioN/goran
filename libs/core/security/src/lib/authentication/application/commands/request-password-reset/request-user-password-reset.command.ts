import { Command, CommandProps } from '@goran/common';

export class RequestUserPassswordResetCommand extends Command {
    readonly email: string;

    constructor(props: CommandProps<RequestUserPassswordResetCommand>) {
        super(props);
        this.email = props.email;
    }
}
