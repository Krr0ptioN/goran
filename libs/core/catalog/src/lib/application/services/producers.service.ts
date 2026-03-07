import { Injectable } from '@nestjs/common';
import { ExceptionBase } from '@goran/common';
import { Err, Option, Result } from 'oxide.ts';
import {
    CatalogRecordNotFoundError,
    CreateProducerProps,
    ProducerEntity,
} from '../../domain';
import { ProducersRepository } from '../ports';

@Injectable()
export class ProducersService {
    constructor(private readonly producersRepository: ProducersRepository) {}

    async create(
        command: CreateProducerProps,
    ): Promise<Result<ProducerEntity, ExceptionBase>> {
        const producer = ProducerEntity.create(command);
        return await this.producersRepository.create(producer);
    }

    async update(
        producerId: string,
        changes: Partial<CreateProducerProps>,
    ): Promise<Result<ProducerEntity, ExceptionBase>> {
        const found = await this.producersRepository.findOneById(producerId);
        if (found.isNone()) {
            return Err(new CatalogRecordNotFoundError('producer', producerId));
        }

        const current = found.unwrap();
        const {
            id: _id,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...currentProps
        } = current.getProps();

        const next = new ProducerEntity({
            id: current.id,
            createdAt: current.createdAt,
            props: {
                ...currentProps,
                ...changes,
                songIds: changes.songIds ?? currentProps.songIds,
                genreIds: changes.genreIds ?? currentProps.genreIds,
                albumIds: changes.albumIds ?? currentProps.albumIds,
            },
        });

        return await this.producersRepository.update(next);
    }

    async delete(producerId: string): Promise<Result<true, ExceptionBase>> {
        return await this.producersRepository.delete(producerId);
    }

    async findOneById(producerId: string): Promise<Option<ProducerEntity>> {
        return await this.producersRepository.findOneById(producerId);
    }

    async findAll(): Promise<ProducerEntity[]> {
        return await this.producersRepository.findAll();
    }
}
