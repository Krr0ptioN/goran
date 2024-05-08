export interface RepositoryQueryOptions<T> {
    values: T;
}

export type SingleEntityReturn<T> = Promise<T | null> | T | null;
export type QueryEntityReturn<T> = Promise<T[] | null> | T[] | null;

/**
 * @interface ResourceRepository
 *
 * Interface that defines CRUD operations for repostories
 *
 * @template T Entity type
 * @template TM Mutation Entity type
 * @template TI Info only Entity type
 */
export interface ResourceRepository<T, TM, TI> {
    findOneById: (targetId: number) => SingleEntityReturn<T>;
    findOne: (target: Partial<TI>) => SingleEntityReturn<T>;
    findAll: (options?: RepositoryQueryOptions<TI>) => QueryEntityReturn<T>;
    create: (value: TM) => SingleEntityReturn<TI>;
    update: (targetId: number, value: Partial<TM>) => SingleEntityReturn<TI>;
    delete: (target: Partial<TI>) => SingleEntityReturn<TI>;
}
