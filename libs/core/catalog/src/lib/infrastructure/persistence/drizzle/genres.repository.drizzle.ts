import { Injectable } from '@nestjs/common';
import { DrizzleService, GenresTable } from '@goran/drizzle-data-access';
import { eq } from 'drizzle-orm';
import { Err, None, Ok, Option, Result, Some } from 'oxide.ts';
import { ExceptionBase } from '@goran/common';
import {
    CatalogPersistenceError,
    CatalogRecordNotFoundError,
    GenreEntity,
} from '../../../domain';
import { GenresRepository } from '../../../application';

@Injectable()
export class GenresRepositoryDrizzle implements GenresRepository {
    constructor(private readonly drizzleService: DrizzleService) {}

    async create(
        genre: GenreEntity,
    ): Promise<Result<GenreEntity, ExceptionBase>> {
        const props = genre.getProps();

        try {
            await this.drizzleService.db.insert(GenresTable).values({
                id: props.id,
                ownerId: props.ownerId,
                name: props.name,
            });

            return Ok(genre);
        } catch (error) {
            return Err(
                new CatalogPersistenceError('genre', 'create', error as Error),
            );
        }
    }

    async update(
        genre: GenreEntity,
    ): Promise<Result<GenreEntity, ExceptionBase>> {
        const props = genre.getProps();

        try {
            const [updated] = await this.drizzleService.db
                .update(GenresTable)
                .set({
                    ownerId: props.ownerId,
                    name: props.name,
                })
                .where(eq(GenresTable.id, props.id))
                .returning({ id: GenresTable.id });

            if (!updated) {
                return Err(new CatalogRecordNotFoundError('genre', props.id));
            }

            return Ok(genre);
        } catch (error) {
            return Err(
                new CatalogPersistenceError('genre', 'update', error as Error),
            );
        }
    }

    async delete(genreId: string): Promise<Result<true, ExceptionBase>> {
        try {
            const [deleted] = await this.drizzleService.db
                .delete(GenresTable)
                .where(eq(GenresTable.id, genreId))
                .returning({ id: GenresTable.id });

            if (!deleted) {
                return Err(new CatalogRecordNotFoundError('genre', genreId));
            }

            return Ok(true);
        } catch (error) {
            return Err(
                new CatalogPersistenceError('genre', 'delete', error as Error),
            );
        }
    }

    async findOneById(genreId: string): Promise<Option<GenreEntity>> {
        const [row] = await this.drizzleService.db
            .select()
            .from(GenresTable)
            .where(eq(GenresTable.id, genreId));

        if (!row) {
            return None;
        }

        return Some(
            new GenreEntity({
                id: row.id,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                props: {
                    ownerId: row.ownerId,
                    name: row.name,
                },
            }),
        );
    }

    async findAll(): Promise<GenreEntity[]> {
        const rows = await this.drizzleService.db.select().from(GenresTable);
        return rows.map(
            (row) =>
                new GenreEntity({
                    id: row.id,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    props: {
                        ownerId: row.ownerId,
                        name: row.name,
                    },
                }),
        );
    }
}
