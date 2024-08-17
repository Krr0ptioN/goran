import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneUserByEmailQuery } from './findone-user-by-email.query';
import { Err, Ok, Result } from 'oxide.ts';
import { UsersRepository, UserNotFoundError, UserModel } from '@goran/users';
import { ExceptionBase } from '@goran/common';

@QueryHandler(FindOneUserByEmailQuery)
export class FindOneUserByEmailQueryHandler implements IQueryHandler {
    constructor(private readonly userRepo: UsersRepository) { }

    async execute(
        query: FindOneUserByEmailQuery
    ): Promise<Result<UserModel, ExceptionBase>> {
        const user = await this.userRepo.findOneByEmail(query.email);
        return user.isSome()
            ? Ok(user.unwrap())
            : Err(
                new UserNotFoundError(
                    new Error('No such user found with corresponding email')
                )
            );
    }
}
