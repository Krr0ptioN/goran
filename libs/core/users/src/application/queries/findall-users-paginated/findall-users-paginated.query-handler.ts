import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadModelUsersRepository } from '../../ports';
import { UserModel } from '../../models';

import { FindAllUsersPaginatedQuery } from './findall-users-paginated.query';
import { ExceptionBase, Paginated } from '@goran/common';
import { Ok, Result } from 'oxide.ts';

@QueryHandler(FindAllUsersPaginatedQuery)
export class FindAllUsersPaginatedQueryHandler implements IQueryHandler {
    constructor(private readonly userRepo: ReadModelUsersRepository) {}

    async execute(
        query: FindAllUsersPaginatedQuery
    ): Promise<Result<Paginated<UserModel>, ExceptionBase>> {
        const result = await this.userRepo.findAllPaginated(query);
        return Ok(result);
    }
}
