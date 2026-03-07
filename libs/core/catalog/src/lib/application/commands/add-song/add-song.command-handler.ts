import { AddSongCommand } from './add-song.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { SongEntity } from '../../../domain';
import { SongsService } from '../../services';

@CommandHandler(AddSongCommand)
export class AddSongCommandHandler implements ICommandHandler<AddSongCommand> {
    constructor(
        @InjectPinoLogger(AddSongCommandHandler.name)
        private readonly logger: PinoLogger,
        private readonly songsService: SongsService,
    ) {}

    async execute(
        command: AddSongCommand,
    ): Promise<Result<SongEntity, ExceptionBase>> {
        this.logger.debug({ command }, 'Creating song through command handler');
        return await this.songsService.create({
            userId: command.userId,
            title: command.title,
            duration: command.duration,
            releasedDate: command.releasedDate,
            audioFileKey: command.audioFileKey,
            coverImageKey: command.coverImageKey,
            albumId: command.albumId,
            producerIds: command.producerIds,
            genreIds: command.genreIds,
        });
    }
}
