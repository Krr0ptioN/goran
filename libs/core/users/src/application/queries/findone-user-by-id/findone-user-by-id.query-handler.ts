import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneUserByIdQuery } from './findone-user-by-id.query';
import { Option } from 'oxide.ts';
import { UserModel } from '../../models';
import { ReadModelUsersRepository } from '../../ports';

@QueryHandler(FindOneUserByIdQuery)
export class FindOneUserByIdQueryHandler implements IQueryHandler {
    constructor(private readonly userRepo: ReadModelUsersRepository) { }

    async execute(
        query: FindOneUserByIdQuery
    ): Promise<Option<UserModel>> {
        const user = await this.userRepo.findOneById(query.id);
        return user;
    }
}
