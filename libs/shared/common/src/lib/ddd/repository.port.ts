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

export type PaginatedQueryParams = {
    limit: number;
    page: number;
    offset: number;
    orderBy: OrderBy;
};

export interface WriteManyModelRepositoryPort<Entity> {
    insert(entities: Entity[]): Promise<Result<Entity[], ExceptionBase>>;
}

export interface WriteModelRepositoryPort<Entity> {
    insertOne(entity: Entity): Promise<Result<Entity, ExceptionBase>>;
    delete(entity: Entity): Promise<Result<boolean, ExceptionBase>>;
}

export interface ReadModelRepositoryPort<EntityModel> {
    findOneById(id: string): Promise<Option<EntityModel>>;
    findAll(): Promise<EntityModel[]>;
    findAllPaginated(
        params: PaginatedQueryParams
    ): Promise<Paginated<EntityModel>>;
}
