import { AggregateID, Command, CommandProps } from '@goran/common';

/**
 * Signup - User Registration
 *
 * @param userId
 * @param producerIds
 * @param albumId
 * @param mediaId
 * @param releasedDate
 * @param title
 */
export class AddSongCommand extends Command {
    readonly userId: AggregateID;
    readonly producerIds: AggregateID[];
    readonly albumId: AggregateID;
    readonly mediaId: AggregateID;
    readonly releasedDate: Date;
    readonly title: string;

    constructor(props: CommandProps<AddSongCommand>) {
        super(props);
        this.userId = props.userId;
        this.producerIds = props.producerIds;
        this.albumId = props.albumId;
        this.mediaId = props.mediaId;
        this.releasedDate = props.releasedDate;
        this.title = props.title;
    }
}
