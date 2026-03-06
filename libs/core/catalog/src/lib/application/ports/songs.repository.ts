import { ExceptionBase } from '@goran/common';
import { Option, Result } from 'oxide.ts';
import { SongEntity } from '../../domain';

export abstract class SongsRepository {
    abstract create(
        song: SongEntity,
    ): Promise<Result<SongEntity, ExceptionBase>>;
    abstract update(
        song: SongEntity,
    ): Promise<Result<SongEntity, ExceptionBase>>;
    abstract delete(songId: string): Promise<Result<true, ExceptionBase>>;
    abstract findOneById(songId: string): Promise<Option<SongEntity>>;
    abstract findAll(): Promise<SongEntity[]>;
}
