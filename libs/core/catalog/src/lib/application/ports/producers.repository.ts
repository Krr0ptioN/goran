import { ExceptionBase } from '@goran/common';
import { Option, Result } from 'oxide.ts';
import { ProducerEntity } from '../../domain';

export abstract class ProducersRepository {
    abstract create(
        producer: ProducerEntity,
    ): Promise<Result<ProducerEntity, ExceptionBase>>;
    abstract update(
        producer: ProducerEntity,
    ): Promise<Result<ProducerEntity, ExceptionBase>>;
    abstract delete(producerId: string): Promise<Result<true, ExceptionBase>>;
    abstract findOneById(producerId: string): Promise<Option<ProducerEntity>>;
    abstract findAll(): Promise<ProducerEntity[]>;
}
