import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneUserByIdQuery } from './findone-user-by-id.query';
import { Err, Ok, Result } from 'oxide.ts';
import { UsersRepository, UserModel, UserNotFoundError } from '../../..';
import { ExceptionBase } from '@goran/common';

@QueryHandler(FindOneUserByIdQuery)
export class FindOneUserByIdQueryHandler implements IQueryHandler {
    constructor(private readonly userRepo: UsersRepository) { }

    async execute(
        query: FindOneUserByIdQuery
    ): Promise<Result<UserModel, ExceptionBase>> {
        const user = await this.userRepo.findOneById(query.id);
        return user.isSome()
            ? Ok(user.unwrap())
            : Err(new UserNotFoundError());
    }
}
