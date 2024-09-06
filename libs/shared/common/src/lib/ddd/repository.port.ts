import { Option, Result } from 'oxide.ts';
import { ExceptionBase } from '../exceptions';

export class Paginated<T> {
    readonly count: number;
    readonly limit: number;
    readonly page: number;
    readonly data: readonly T[];

    constructor(props: Paginated<T>) {
        this.count = props.count;
        this.limit = props.limit;
        this.page = props.page;
        this.data = props.data;
    }
}

export type OrderBy = { field: string | true; param: 'asc' | 'desc' };

export interface PaginatedQueryParams {
    limit: number;
    page: number;
    offset: number;
    orderBy: OrderBy;
}

export abstract class WriteManyModelRepositoryPort<Entity> {
    abstract insert(entities: Entity[]): Promise<Result<Entity[], ExceptionBase>>;
}

export abstract class WriteModelRepositoryPort<Entity> {
    abstract insertOne(entity: Entity): Promise<Result<Entity, ExceptionBase>>;
    abstract delete(entity: Entity): Promise<Result<boolean, ExceptionBase>>;
}

export abstract class ReadModelRepositoryPort<EntityModel> {
    abstract findOneById(id: string): Promise<Option<EntityModel>>;
    abstract findAll(): Promise<EntityModel[]>;
    abstract findAllPaginated(
        params: PaginatedQueryParams
    ): Promise<Paginated<EntityModel>>;
}
