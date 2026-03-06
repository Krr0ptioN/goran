import { Injectable } from '@nestjs/common';
import {
    AlbumsSongsTable,
    DrizzleService,
    ProducersSongsTable,
    SongsGenresTable,
    SongsTable,
} from '@goran/drizzle-data-access';
import { eq } from 'drizzle-orm';
import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import {
    CatalogPersistenceError,
    CatalogRecordNotFoundError,
    SongEntity,
} from '../../../domain';
import { SongsRepository } from '../../../application';
import { toDate, toDateOnly } from './date.util';

@Injectable()
export class SongsRepositoryDrizzle implements SongsRepository {
    constructor(private readonly drizzleService: DrizzleService) {}

    async create(song: SongEntity): Promise<Result<SongEntity, ExceptionBase>> {
        const props = song.getProps();

        try {
            await this.drizzleService.db.transaction(async (tx) => {
                await tx.insert(SongsTable).values({
                    id: props.id,
                    userId: props.userId,
                    title: props.title,
                    duration: props.duration,
                    releasedDate: toDateOnly(props.releasedDate),
                    audioFileKey: props.audioFileKey,
                    coverImageKey: props.coverImageKey,
                });

                if (props.genreIds.length) {
                    await tx.insert(SongsGenresTable).values(
                        props.genreIds.map((genreId) => ({
                            songId: props.id,
                            genreId,
                        })),
                    );
                }

                if (props.producerIds.length) {
                    await tx.insert(ProducersSongsTable).values(
                        props.producerIds.map((producerId) => ({
                            songId: props.id,
                            producerId,
                        })),
                    );
                }

                if (props.albumId) {
                    await tx.insert(AlbumsSongsTable).values({
                        songId: props.id,
                        albumId: props.albumId,
                    });
                }
            });

            const created = await this.findOneById(props.id);
            if (created.isNone()) {
                return Err(new CatalogPersistenceError('song', 'create'));
            }

            return Ok(created.unwrap());
        } catch (error) {
            return Err(
                new CatalogPersistenceError('song', 'create', error as Error),
            );
        }
    }

    async update(song: SongEntity): Promise<Result<SongEntity, ExceptionBase>> {
        const props = song.getProps();

        try {
            await this.drizzleService.db.transaction(async (tx) => {
                const [updated] = await tx
                    .update(SongsTable)
                    .set({
                        userId: props.userId,
                        title: props.title,
                        duration: props.duration,
                        releasedDate: toDateOnly(props.releasedDate),
                        audioFileKey: props.audioFileKey,
                        coverImageKey: props.coverImageKey,
                    })
                    .where(eq(SongsTable.id, props.id))
                    .returning({ id: SongsTable.id });

                if (!updated) {
                    throw new CatalogRecordNotFoundError('song', props.id);
                }

                await tx
                    .delete(SongsGenresTable)
                    .where(eq(SongsGenresTable.songId, props.id));
                await tx
                    .delete(ProducersSongsTable)
                    .where(eq(ProducersSongsTable.songId, props.id));
                await tx
                    .delete(AlbumsSongsTable)
                    .where(eq(AlbumsSongsTable.songId, props.id));

                if (props.genreIds.length) {
                    await tx.insert(SongsGenresTable).values(
                        props.genreIds.map((genreId) => ({
                            songId: props.id,
                            genreId,
                        })),
                    );
                }

                if (props.producerIds.length) {
                    await tx.insert(ProducersSongsTable).values(
                        props.producerIds.map((producerId) => ({
                            songId: props.id,
                            producerId,
                        })),
                    );
                }

                if (props.albumId) {
                    await tx.insert(AlbumsSongsTable).values({
                        songId: props.id,
                        albumId: props.albumId,
                    });
                }
            });

            const updated = await this.findOneById(props.id);
            if (updated.isNone()) {
                return Err(new CatalogRecordNotFoundError('song', props.id));
            }

            return Ok(updated.unwrap());
        } catch (error) {
            if (error instanceof CatalogRecordNotFoundError) {
                return Err(error);
            }

            return Err(
                new CatalogPersistenceError('song', 'update', error as Error),
            );
        }
    }

    async delete(songId: string): Promise<Result<true, ExceptionBase>> {
        try {
            const deleted = await this.drizzleService.db.transaction(
                async (tx) => {
                    await tx
                        .delete(SongsGenresTable)
                        .where(eq(SongsGenresTable.songId, songId));
                    await tx
                        .delete(ProducersSongsTable)
                        .where(eq(ProducersSongsTable.songId, songId));
                    await tx
                        .delete(AlbumsSongsTable)
                        .where(eq(AlbumsSongsTable.songId, songId));

                    const [deletedSong] = await tx
                        .delete(SongsTable)
                        .where(eq(SongsTable.id, songId))
                        .returning({ id: SongsTable.id });

                    return deletedSong;
                },
            );

            if (!deleted) {
                return Err(new CatalogRecordNotFoundError('song', songId));
            }

            return Ok(true);
        } catch (error) {
            if (error instanceof CatalogRecordNotFoundError) {
                return Err(error);
            }

            return Err(
                new CatalogPersistenceError('song', 'delete', error as Error),
            );
        }
    }

    async findOneById(songId: string): Promise<Option<SongEntity>> {
        const [row] = await this.drizzleService.db
            .select()
            .from(SongsTable)
            .where(eq(SongsTable.id, songId));

        if (!row) {
            return None;
        }

        return Some(await this.hydrateSong(row));
    }

    async findAll(): Promise<SongEntity[]> {
        const rows = await this.drizzleService.db.select().from(SongsTable);
        return await Promise.all(rows.map((row) => this.hydrateSong(row)));
    }

    private async hydrateSong(
        row: typeof SongsTable.$inferSelect,
    ): Promise<SongEntity> {
        const [producerRows, genreRows, albumRows] = await Promise.all([
            this.drizzleService.db
                .select({ producerId: ProducersSongsTable.producerId })
                .from(ProducersSongsTable)
                .where(eq(ProducersSongsTable.songId, row.id)),
            this.drizzleService.db
                .select({ genreId: SongsGenresTable.genreId })
                .from(SongsGenresTable)
                .where(eq(SongsGenresTable.songId, row.id)),
            this.drizzleService.db
                .select({ albumId: AlbumsSongsTable.albumId })
                .from(AlbumsSongsTable)
                .where(eq(AlbumsSongsTable.songId, row.id)),
        ]);

        return new SongEntity({
            id: row.id,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            props: {
                userId: row.userId,
                title: row.title,
                duration: row.duration,
                releasedDate: toDate(row.releasedDate),
                audioFileKey: row.audioFileKey,
                coverImageKey: row.coverImageKey,
                albumId: albumRows[0]?.albumId ?? null,
                producerIds: producerRows.map((item) => item.producerId),
                genreIds: genreRows.map((item) => item.genreId),
            },
        });
    }
}
