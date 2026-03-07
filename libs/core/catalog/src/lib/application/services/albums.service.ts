import { Injectable } from '@nestjs/common';
import { ExceptionBase } from '@goran/common';
import { Err, Option, Result } from 'oxide.ts';
import {
    AlbumEntity,
    CatalogRecordNotFoundError,
    CreateAlbumProps,
} from '../../domain';
import { AlbumsRepository } from '../ports';

@Injectable()
export class AlbumsService {
    constructor(private readonly albumsRepository: AlbumsRepository) {}

    async create(
        command: CreateAlbumProps,
    ): Promise<Result<AlbumEntity, ExceptionBase>> {
        const album = AlbumEntity.create(command);
        return await this.albumsRepository.create(album);
    }

    async update(
        albumId: string,
        changes: Partial<CreateAlbumProps>,
    ): Promise<Result<AlbumEntity, ExceptionBase>> {
        const found = await this.albumsRepository.findOneById(albumId);
        if (found.isNone()) {
            return Err(new CatalogRecordNotFoundError('album', albumId));
        }

        const current = found.unwrap();
        const {
            id: _id,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...currentProps
        } = current.getProps();

        const next = new AlbumEntity({
            id: current.id,
            createdAt: current.createdAt,
            props: {
                ...currentProps,
                ...changes,
                producerIds: changes.producerIds ?? currentProps.producerIds,
                songIds: changes.songIds ?? currentProps.songIds,
            },
        });

        return await this.albumsRepository.update(next);
    }

    async delete(albumId: string): Promise<Result<true, ExceptionBase>> {
        return await this.albumsRepository.delete(albumId);
    }

    async findOneById(albumId: string): Promise<Option<AlbumEntity>> {
        return await this.albumsRepository.findOneById(albumId);
    }

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumsRepository.findAll();
    }
}
