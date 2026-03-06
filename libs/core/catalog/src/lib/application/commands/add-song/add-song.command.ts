import { AggregateID, Command, CommandProps, Optional } from '@goran/common';

export class AddSongCommand extends Command {
    readonly userId: AggregateID;
    readonly producerIds: AggregateID[];
    readonly genreIds: AggregateID[];
    readonly albumId: Optional<AggregateID>;
    readonly audioFileKey: Optional<string>;
    readonly coverImageKey: Optional<string>;
    readonly releasedDate: Optional<Date>;
    readonly duration: number;
    readonly title: string;

    constructor(props: CommandProps<AddSongCommand>) {
        super(props);
        this.userId = props.userId;
        this.producerIds = props.producerIds ?? [];
        this.genreIds = props.genreIds ?? [];
        this.albumId = props.albumId ?? null;
        this.audioFileKey = props.audioFileKey ?? null;
        this.coverImageKey = props.coverImageKey ?? null;
        this.releasedDate = props.releasedDate ?? null;
        this.duration = props.duration;
        this.title = props.title;
    }
}
