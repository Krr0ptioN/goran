import { AddSongCommand } from './add-song.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@CommandHandler(AddSongCommand)
export class AddSongCommandHandler implements ICommandHandler<AddSongCommand> {
    constructor(
        @InjectPinoLogger(AddSongCommandHandler.name)
        private readonly logger: PinoLogger
    ) { }

    // TODO: It should the song
    async execute(
        command: AddSongCommand
    ): Promise<Result<any, ExceptionBase>> { }
}
