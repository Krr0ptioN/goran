import { Injectable } from '@nestjs/common';
import { ExceptionBase } from '@goran/common';
import { Err, Option, Result } from 'oxide.ts';
import {
    CatalogRecordNotFoundError,
    CreateSongProps,
    SongEntity,
} from '../../domain';
import { SongsRepository } from '../ports';

@Injectable()
export class SongsService {
    constructor(private readonly songsRepository: SongsRepository) {}

    async create(
        command: CreateSongProps,
    ): Promise<Result<SongEntity, ExceptionBase>> {
        const song = SongEntity.create(command);
        return await this.songsRepository.create(song);
    }

    async update(
        songId: string,
        changes: Partial<CreateSongProps>,
    ): Promise<Result<SongEntity, ExceptionBase>> {
        const found = await this.songsRepository.findOneById(songId);
        if (found.isNone()) {
            return Err(new CatalogRecordNotFoundError('song', songId));
        }

        const current = found.unwrap();
        const {
            id: _id,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...currentProps
        } = current.getProps();

        const next = new SongEntity({
            id: current.id,
            createdAt: current.createdAt,
            props: {
                ...currentProps,
                ...changes,
                producerIds: changes.producerIds ?? currentProps.producerIds,
                genreIds: changes.genreIds ?? currentProps.genreIds,
                albumId: changes.albumId ?? currentProps.albumId,
            },
        });

        return await this.songsRepository.update(next);
    }

    async delete(songId: string): Promise<Result<true, ExceptionBase>> {
        return await this.songsRepository.delete(songId);
    }

    async findOneById(songId: string): Promise<Option<SongEntity>> {
        return await this.songsRepository.findOneById(songId);
    }

    async findAll(): Promise<SongEntity[]> {
        return await this.songsRepository.findAll();
    }
}
