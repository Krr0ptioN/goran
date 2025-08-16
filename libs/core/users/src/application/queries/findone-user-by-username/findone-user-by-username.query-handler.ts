import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { FindOneUserByUsernameQuery } from './findone-user-by-username.query';
import { Err, Ok, Result } from 'oxide.ts';
import { UserNotFoundError } from '../../../domain';
import { UserModel } from '../../models';
import { ReadModelUsersRepository } from '../../ports';
import { ExceptionBase } from '@goran/common';

@QueryHandler(FindOneUserByUsernameQuery)
export class FindOneUserByUsernameQueryHandler
  implements
    IQueryHandler<
      FindOneUserByUsernameQuery,
      Result<UserModel, ExceptionBase>
    >
{
  constructor(private readonly userRepo: ReadModelUsersRepository) {}

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
