import { Injectable } from '@nestjs/common';
import {
    AlbumsProducersTable,
    AlbumsSongsTable,
    AlbumsTable,
    DrizzleService,
} from '@goran/drizzle-data-access';
import { eq } from 'drizzle-orm';
import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import {
    AlbumEntity,
    CatalogPersistenceError,
    CatalogRecordNotFoundError,
} from '../../../domain';
import { AlbumsRepository } from '../../../application';
import { toDate, toDateOnly } from './date.util';

@Injectable()
export class AlbumsRepositoryDrizzle implements AlbumsRepository {
    constructor(private readonly drizzleService: DrizzleService) {}

    async create(
        album: AlbumEntity,
    ): Promise<Result<AlbumEntity, ExceptionBase>> {
        const props = album.getProps();

        try {
            await this.drizzleService.db.transaction(async (tx) => {
                await tx.insert(AlbumsTable).values({
                    id: props.id,
                    name: props.name,
                    coverImageKey: props.coverImageKey,
                    releasedDate: toDateOnly(props.releasedDate),
                });

                if (props.songIds.length) {
                    await tx.insert(AlbumsSongsTable).values(
                        props.songIds.map((songId) => ({
                            albumId: props.id,
                            songId,
                        })),
                    );
                }

                if (props.producerIds.length) {
                    await tx.insert(AlbumsProducersTable).values(
                        props.producerIds.map((producerId) => ({
                            albumId: props.id,
                            producerId,
                        })),
                    );
                }
            });

            const created = await this.findOneById(props.id);
            if (created.isNone()) {
                return Err(new CatalogPersistenceError('album', 'create'));
            }

            return Ok(created.unwrap());
        } catch (error) {
            return Err(
                new CatalogPersistenceError('album', 'create', error as Error),
            );
        }
    }

    async update(
        album: AlbumEntity,
    ): Promise<Result<AlbumEntity, ExceptionBase>> {
        const props = album.getProps();

        try {
            await this.drizzleService.db.transaction(async (tx) => {
                const [updated] = await tx
                    .update(AlbumsTable)
                    .set({
                        name: props.name,
                        coverImageKey: props.coverImageKey,
                        releasedDate: toDateOnly(props.releasedDate),
                    })
                    .where(eq(AlbumsTable.id, props.id))
                    .returning({ id: AlbumsTable.id });

                if (!updated) {
                    throw new CatalogRecordNotFoundError('album', props.id);
                }

                await tx
                    .delete(AlbumsSongsTable)
                    .where(eq(AlbumsSongsTable.albumId, props.id));
                await tx
                    .delete(AlbumsProducersTable)
                    .where(eq(AlbumsProducersTable.albumId, props.id));

                if (props.songIds.length) {
                    await tx.insert(AlbumsSongsTable).values(
                        props.songIds.map((songId) => ({
                            albumId: props.id,
                            songId,
                        })),
                    );
                }

                if (props.producerIds.length) {
                    await tx.insert(AlbumsProducersTable).values(
                        props.producerIds.map((producerId) => ({
                            albumId: props.id,
                            producerId,
                        })),
                    );
                }
            });

            const updated = await this.findOneById(props.id);
            if (updated.isNone()) {
                return Err(new CatalogRecordNotFoundError('album', props.id));
            }

            return Ok(updated.unwrap());
        } catch (error) {
            if (error instanceof CatalogRecordNotFoundError) {
                return Err(error);
            }

            return Err(
                new CatalogPersistenceError('album', 'update', error as Error),
            );
        }
    }

    async delete(albumId: string): Promise<Result<true, ExceptionBase>> {
        try {
            const deleted = await this.drizzleService.db.transaction(
                async (tx) => {
                    await tx
                        .delete(AlbumsSongsTable)
                        .where(eq(AlbumsSongsTable.albumId, albumId));
                    await tx
                        .delete(AlbumsProducersTable)
                        .where(eq(AlbumsProducersTable.albumId, albumId));

                    const [deletedAlbum] = await tx
                        .delete(AlbumsTable)
                        .where(eq(AlbumsTable.id, albumId))
                        .returning({ id: AlbumsTable.id });

                    return deletedAlbum;
                },
            );

            if (!deleted) {
                return Err(new CatalogRecordNotFoundError('album', albumId));
            }

            return Ok(true);
        } catch (error) {
            if (error instanceof CatalogRecordNotFoundError) {
                return Err(error);
            }

            return Err(
                new CatalogPersistenceError('album', 'delete', error as Error),
            );
        }
    }

    async findOneById(albumId: string): Promise<Option<AlbumEntity>> {
        const [row] = await this.drizzleService.db
            .select()
            .from(AlbumsTable)
            .where(eq(AlbumsTable.id, albumId));

        if (!row) {
            return None;
        }

        return Some(await this.hydrateAlbum(row));
    }

    async findAll(): Promise<AlbumEntity[]> {
        const rows = await this.drizzleService.db.select().from(AlbumsTable);
        return await Promise.all(rows.map((row) => this.hydrateAlbum(row)));
    }

    private async hydrateAlbum(
        row: typeof AlbumsTable.$inferSelect,
    ): Promise<AlbumEntity> {
        const [songs, producers] = await Promise.all([
            this.drizzleService.db
                .select({ songId: AlbumsSongsTable.songId })
                .from(AlbumsSongsTable)
                .where(eq(AlbumsSongsTable.albumId, row.id)),
            this.drizzleService.db
                .select({ producerId: AlbumsProducersTable.producerId })
                .from(AlbumsProducersTable)
                .where(eq(AlbumsProducersTable.albumId, row.id)),
        ]);

        return new AlbumEntity({
            id: row.id,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            props: {
                name: row.name ?? '',
                releasedDate: toDate(row.releasedDate),
                coverImageKey: row.coverImageKey,
                songIds: songs.map((item) => item.songId),
                producerIds: producers.map((item) => item.producerId),
            },
        });
    }
}
