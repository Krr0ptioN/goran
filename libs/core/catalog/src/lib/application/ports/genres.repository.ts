import { ExceptionBase } from '@goran/common';
import { Option, Result } from 'oxide.ts';
import { GenreEntity } from '../../domain';

export abstract class GenresRepository {
    abstract create(
        genre: GenreEntity,
    ): Promise<Result<GenreEntity, ExceptionBase>>;
    abstract update(
        genre: GenreEntity,
    ): Promise<Result<GenreEntity, ExceptionBase>>;
    abstract delete(genreId: string): Promise<Result<true, ExceptionBase>>;
    abstract findOneById(genreId: string): Promise<Option<GenreEntity>>;
    abstract findAll(): Promise<GenreEntity[]>;
}
