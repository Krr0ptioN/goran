import { Injectable } from '@nestjs/common';
import {
    AlbumsProducersTable,
    DrizzleService,
    ProducersGenresTable,
    ProducersSongsTable,
    ProducersTable,
} from '@goran/drizzle-data-access';
import { eq } from 'drizzle-orm';
import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import {
    CatalogPersistenceError,
    CatalogRecordNotFoundError,
    ProducerEntity,
} from '../../../domain';
import { ProducersRepository } from '../../../application';

@Injectable()
export class ProducersRepositoryDrizzle implements ProducersRepository {
    constructor(private readonly drizzleService: DrizzleService) {}

    async create(
        producer: ProducerEntity,
    ): Promise<Result<ProducerEntity, ExceptionBase>> {
        const props = producer.getProps();

        try {
            await this.drizzleService.db.transaction(async (tx) => {
                await tx.insert(ProducersTable).values({
                    id: props.id,
                    fullname: props.fullname,
                    nickname: props.nickname,
                    bio: props.bio,
                });

                if (props.songIds.length) {
                    await tx.insert(ProducersSongsTable).values(
                        props.songIds.map((songId) => ({
                            producerId: props.id,
                            songId,
                        })),
                    );
                }

                if (props.genreIds.length) {
                    await tx.insert(ProducersGenresTable).values(
                        props.genreIds.map((genreId) => ({
                            producerId: props.id,
                            genreId,
                        })),
                    );
                }

                if (props.albumIds.length) {
                    await tx.insert(AlbumsProducersTable).values(
                        props.albumIds.map((albumId) => ({
                            producerId: props.id,
                            albumId,
                        })),
                    );
                }
            });

            const created = await this.findOneById(props.id);
            if (created.isNone()) {
                return Err(new CatalogPersistenceError('producer', 'create'));
            }

            return Ok(created.unwrap());
        } catch (error) {
            return Err(
                new CatalogPersistenceError(
                    'producer',
                    'create',
                    error as Error,
                ),
            );
        }
    }

    async update(
        producer: ProducerEntity,
    ): Promise<Result<ProducerEntity, ExceptionBase>> {
        const props = producer.getProps();

        try {
            await this.drizzleService.db.transaction(async (tx) => {
                const [updated] = await tx
                    .update(ProducersTable)
                    .set({
                        fullname: props.fullname,
                        nickname: props.nickname,
                        bio: props.bio,
                    })
                    .where(eq(ProducersTable.id, props.id))
                    .returning({ id: ProducersTable.id });

                if (!updated) {
                    throw new CatalogRecordNotFoundError('producer', props.id);
                }

                await tx
                    .delete(ProducersSongsTable)
                    .where(eq(ProducersSongsTable.producerId, props.id));
                await tx
                    .delete(ProducersGenresTable)
                    .where(eq(ProducersGenresTable.producerId, props.id));
                await tx
                    .delete(AlbumsProducersTable)
                    .where(eq(AlbumsProducersTable.producerId, props.id));

                if (props.songIds.length) {
                    await tx.insert(ProducersSongsTable).values(
                        props.songIds.map((songId) => ({
                            producerId: props.id,
                            songId,
                        })),
                    );
                }

                if (props.genreIds.length) {
                    await tx.insert(ProducersGenresTable).values(
                        props.genreIds.map((genreId) => ({
                            producerId: props.id,
                            genreId,
                        })),
                    );
                }

                if (props.albumIds.length) {
                    await tx.insert(AlbumsProducersTable).values(
                        props.albumIds.map((albumId) => ({
                            producerId: props.id,
                            albumId,
                        })),
                    );
                }
            });

            const updated = await this.findOneById(props.id);
            if (updated.isNone()) {
                return Err(
                    new CatalogRecordNotFoundError('producer', props.id),
                );
            }

            return Ok(updated.unwrap());
        } catch (error) {
            if (error instanceof CatalogRecordNotFoundError) {
                return Err(error);
            }

            return Err(
                new CatalogPersistenceError(
                    'producer',
                    'update',
                    error as Error,
                ),
            );
        }
    }

    async delete(producerId: string): Promise<Result<true, ExceptionBase>> {
        try {
            const deleted = await this.drizzleService.db.transaction(
                async (tx) => {
                    await tx
                        .delete(ProducersSongsTable)
                        .where(eq(ProducersSongsTable.producerId, producerId));
                    await tx
                        .delete(ProducersGenresTable)
                        .where(eq(ProducersGenresTable.producerId, producerId));
                    await tx
                        .delete(AlbumsProducersTable)
                        .where(eq(AlbumsProducersTable.producerId, producerId));

                    const [deletedProducer] = await tx
                        .delete(ProducersTable)
                        .where(eq(ProducersTable.id, producerId))
                        .returning({ id: ProducersTable.id });

                    return deletedProducer;
                },
            );

            if (!deleted) {
                return Err(
                    new CatalogRecordNotFoundError('producer', producerId),
                );
            }

            return Ok(true);
        } catch (error) {
            if (error instanceof CatalogRecordNotFoundError) {
                return Err(error);
            }

            return Err(
                new CatalogPersistenceError(
                    'producer',
                    'delete',
                    error as Error,
                ),
            );
        }
    }

    async findOneById(producerId: string): Promise<Option<ProducerEntity>> {
        const [row] = await this.drizzleService.db
            .select()
            .from(ProducersTable)
            .where(eq(ProducersTable.id, producerId));

        if (!row) {
            return None;
        }

        return Some(await this.hydrateProducer(row));
    }

    async findAll(): Promise<ProducerEntity[]> {
        const rows = await this.drizzleService.db.select().from(ProducersTable);
        return await Promise.all(rows.map((row) => this.hydrateProducer(row)));
    }

    private async hydrateProducer(
        row: typeof ProducersTable.$inferSelect,
    ): Promise<ProducerEntity> {
        const [songs, genres, albums] = await Promise.all([
            this.drizzleService.db
                .select({ songId: ProducersSongsTable.songId })
                .from(ProducersSongsTable)
                .where(eq(ProducersSongsTable.producerId, row.id)),
            this.drizzleService.db
                .select({ genreId: ProducersGenresTable.genreId })
                .from(ProducersGenresTable)
                .where(eq(ProducersGenresTable.producerId, row.id)),
            this.drizzleService.db
                .select({ albumId: AlbumsProducersTable.albumId })
                .from(AlbumsProducersTable)
                .where(eq(AlbumsProducersTable.producerId, row.id)),
        ]);

        return new ProducerEntity({
            id: row.id,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            props: {
                fullname: row.fullname ?? '',
                nickname: row.nickname,
                bio: row.bio,
                songIds: songs.map((item) => item.songId),
                genreIds: genres.map((item) => item.genreId),
                albumIds: albums.map((item) => item.albumId),
            },
        });
    }
}
