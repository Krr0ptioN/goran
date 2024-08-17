import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneUserByUsernameQuery } from './findone-user-by-username.query';
import { Err, Ok, Result } from 'oxide.ts';
import { UsersRepository, UserModel, UserNotFoundError } from '@goran/users';
import { ExceptionBase } from '@goran/common';

@QueryHandler(FindOneUserByUsernameQuery)
export class FindOneUserByUsernameQueryHandler implements IQueryHandler {
  constructor(private readonly userRepo: UsersRepository) {}

  async execute(
    query: FindOneUserByUsernameQuery
  ): Promise<Result<UserModel, ExceptionBase>> {
    const user = await this.userRepo.findOneByUsername(query.username);
    return user.isSome()
      ? Ok(user.unwrap())
      : Err(
          new UserNotFoundError(
            new Error('No such user found with corresponding username')
          )
        );
  }
}
