import { ExceptionBase } from '@goran/common';
import { Option, Result } from 'oxide.ts';
import { PlaylistEntity } from '../../domain';

export abstract class PlaylistsRepository {
    abstract create(
        playlist: PlaylistEntity,
    ): Promise<Result<PlaylistEntity, ExceptionBase>>;
    abstract update(
        playlist: PlaylistEntity,
    ): Promise<Result<PlaylistEntity, ExceptionBase>>;
    abstract delete(playlistId: string): Promise<Result<true, ExceptionBase>>;
    abstract findOneById(playlistId: string): Promise<Option<PlaylistEntity>>;
    abstract findAll(): Promise<PlaylistEntity[]>;
}
