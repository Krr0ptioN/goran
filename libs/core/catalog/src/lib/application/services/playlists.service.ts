import { Injectable } from '@nestjs/common';
import { ExceptionBase } from '@goran/common';
import { Err, Option, Result } from 'oxide.ts';
import {
    CatalogRecordNotFoundError,
    CreatePlaylistProps,
    PlaylistEntity,
} from '../../domain';
import { PlaylistsRepository } from '../ports';

@Injectable()
export class PlaylistsService {
    constructor(private readonly playlistsRepository: PlaylistsRepository) {}

    async create(
        command: CreatePlaylistProps,
    ): Promise<Result<PlaylistEntity, ExceptionBase>> {
        const playlist = PlaylistEntity.create(command);
        return await this.playlistsRepository.create(playlist);
    }

    async update(
        playlistId: string,
        changes: Partial<CreatePlaylistProps>,
    ): Promise<Result<PlaylistEntity, ExceptionBase>> {
        const found = await this.playlistsRepository.findOneById(playlistId);
        if (found.isNone()) {
            return Err(new CatalogRecordNotFoundError('playlist', playlistId));
        }

        const current = found.unwrap();
        const {
            id: _id,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...currentProps
        } = current.getProps();

        const next = new PlaylistEntity({
            id: current.id,
            createdAt: current.createdAt,
            props: {
                ...currentProps,
                ...changes,
                songIds: changes.songIds ?? currentProps.songIds,
            },
        });

        return await this.playlistsRepository.update(next);
    }

    async delete(playlistId: string): Promise<Result<true, ExceptionBase>> {
        return await this.playlistsRepository.delete(playlistId);
    }

    async findOneById(playlistId: string): Promise<Option<PlaylistEntity>> {
        return await this.playlistsRepository.findOneById(playlistId);
    }

    async findAll(): Promise<PlaylistEntity[]> {
        return await this.playlistsRepository.findAll();
    }
}
