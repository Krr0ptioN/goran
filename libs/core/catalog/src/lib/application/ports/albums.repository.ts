import { ExceptionBase } from '@goran/common';
import { Option, Result } from 'oxide.ts';
import { AlbumEntity } from '../../domain';

export abstract class AlbumsRepository {
    abstract create(
        album: AlbumEntity,
    ): Promise<Result<AlbumEntity, ExceptionBase>>;
    abstract update(
        album: AlbumEntity,
    ): Promise<Result<AlbumEntity, ExceptionBase>>;
    abstract delete(albumId: string): Promise<Result<true, ExceptionBase>>;
    abstract findOneById(albumId: string): Promise<Option<AlbumEntity>>;
    abstract findAll(): Promise<AlbumEntity[]>;
}
