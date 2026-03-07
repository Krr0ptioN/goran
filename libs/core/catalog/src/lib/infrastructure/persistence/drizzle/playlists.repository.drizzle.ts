import { Injectable } from '@nestjs/common';
import {
    DrizzleService,
    PlaylistsSongsTable,
    PlaylistsTable,
} from '@goran/drizzle-data-access';
import { eq } from 'drizzle-orm';
import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import {
    CatalogPersistenceError,
    CatalogRecordNotFoundError,
    PlaylistEntity,
} from '../../../domain';
import { PlaylistsRepository } from '../../../application';

@Injectable()
export class PlaylistsRepositoryDrizzle implements PlaylistsRepository {
    constructor(private readonly drizzleService: DrizzleService) {}

    async create(
        playlist: PlaylistEntity,
    ): Promise<Result<PlaylistEntity, ExceptionBase>> {
        const props = playlist.getProps();

        try {
            await this.drizzleService.db.transaction(async (tx) => {
                await tx.insert(PlaylistsTable).values({
                    id: props.id,
                    ownerId: props.ownerId,
                    name: props.name,
                    description: props.description,
                    coverImageKey: props.coverImageKey,
                });

                if (props.songIds.length) {
                    await tx.insert(PlaylistsSongsTable).values(
                        props.songIds.map((songId) => ({
                            playlistId: props.id,
                            songId,
                        })),
                    );
                }
            });

            return Ok(playlist);
        } catch (error) {
            return Err(
                new CatalogPersistenceError(
                    'playlist',
                    'create',
                    error as Error,
                ),
            );
        }
    }

    async update(
        playlist: PlaylistEntity,
    ): Promise<Result<PlaylistEntity, ExceptionBase>> {
        const props = playlist.getProps();

        try {
            await this.drizzleService.db.transaction(async (tx) => {
                const [updated] = await tx
                    .update(PlaylistsTable)
                    .set({
                        ownerId: props.ownerId,
                        name: props.name,
                        description: props.description,
                        coverImageKey: props.coverImageKey,
                    })
                    .where(eq(PlaylistsTable.id, props.id))
                    .returning({ id: PlaylistsTable.id });

                if (!updated) {
                    throw new CatalogRecordNotFoundError('playlist', props.id);
                }

                await tx
                    .delete(PlaylistsSongsTable)
                    .where(eq(PlaylistsSongsTable.playlistId, props.id));

                if (props.songIds.length) {
                    await tx.insert(PlaylistsSongsTable).values(
                        props.songIds.map((songId) => ({
                            playlistId: props.id,
                            songId,
                        })),
                    );
                }
            });

            return Ok(playlist);
        } catch (error) {
            if (error instanceof CatalogRecordNotFoundError) {
                return Err(error);
            }

            return Err(
                new CatalogPersistenceError(
                    'playlist',
                    'update',
                    error as Error,
                ),
            );
        }
    }

    async delete(playlistId: string): Promise<Result<true, ExceptionBase>> {
        try {
            const deleted = await this.drizzleService.db.transaction(
                async (tx) => {
                    await tx
                        .delete(PlaylistsSongsTable)
                        .where(eq(PlaylistsSongsTable.playlistId, playlistId));

                    const [deletedPlaylist] = await tx
                        .delete(PlaylistsTable)
                        .where(eq(PlaylistsTable.id, playlistId))
                        .returning({ id: PlaylistsTable.id });

                    return deletedPlaylist;
                },
            );

            if (!deleted) {
                return Err(
                    new CatalogRecordNotFoundError('playlist', playlistId),
                );
            }

            return Ok(true);
        } catch (error) {
            if (error instanceof CatalogRecordNotFoundError) {
                return Err(error);
            }

            return Err(
                new CatalogPersistenceError(
                    'playlist',
                    'delete',
                    error as Error,
                ),
            );
        }
    }

    async findOneById(playlistId: string): Promise<Option<PlaylistEntity>> {
        const [row] = await this.drizzleService.db
            .select()
            .from(PlaylistsTable)
            .where(eq(PlaylistsTable.id, playlistId));

        if (!row) {
            return None;
        }

        return Some(await this.hydratePlaylist(row));
    }

    async findAll(): Promise<PlaylistEntity[]> {
        const rows = await this.drizzleService.db.select().from(PlaylistsTable);
        return await Promise.all(rows.map((row) => this.hydratePlaylist(row)));
    }

    private async hydratePlaylist(
        row: typeof PlaylistsTable.$inferSelect,
    ): Promise<PlaylistEntity> {
        const songs = await this.drizzleService.db
            .select({ songId: PlaylistsSongsTable.songId })
            .from(PlaylistsSongsTable)
            .where(eq(PlaylistsSongsTable.playlistId, row.id));

        return new PlaylistEntity({
            id: row.id,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            props: {
                ownerId: row.ownerId,
                name: row.name ?? '',
                description: row.description,
                coverImageKey: row.coverImageKey,
                songIds: songs.map((item) => item.songId),
            },
        });
    }
}
