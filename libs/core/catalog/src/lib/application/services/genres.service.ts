import { Injectable } from '@nestjs/common';
import { ExceptionBase } from '@goran/common';
import { Err, Option, Result } from 'oxide.ts';
import {
    CatalogRecordNotFoundError,
    CreateGenreProps,
    GenreEntity,
} from '../../domain';
import { GenresRepository } from '../ports';

@Injectable()
export class GenresService {
    constructor(private readonly genresRepository: GenresRepository) {}

    async create(
        command: CreateGenreProps,
    ): Promise<Result<GenreEntity, ExceptionBase>> {
        const genre = GenreEntity.create(command);
        return await this.genresRepository.create(genre);
    }

    async update(
        genreId: string,
        changes: Partial<CreateGenreProps>,
    ): Promise<Result<GenreEntity, ExceptionBase>> {
        const found = await this.genresRepository.findOneById(genreId);
        if (found.isNone()) {
            return Err(new CatalogRecordNotFoundError('genre', genreId));
        }

        const current = found.unwrap();
        const {
            id: _id,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...currentProps
        } = current.getProps();

        const next = new GenreEntity({
            id: current.id,
            createdAt: current.createdAt,
            props: {
                ...currentProps,
                ...changes,
            },
        });

        return await this.genresRepository.update(next);
    }

    async delete(genreId: string): Promise<Result<true, ExceptionBase>> {
        return await this.genresRepository.delete(genreId);
    }

    async findOneById(genreId: string): Promise<Option<GenreEntity>> {
        return await this.genresRepository.findOneById(genreId);
    }

    async findAll(): Promise<GenreEntity[]> {
        return await this.genresRepository.findAll();
    }
}
