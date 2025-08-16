import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { FindOneUserByEmailQuery } from './findone-user-by-email.query';
import { Err, Ok, Result } from 'oxide.ts';
import { UserNotFoundError } from '../../../domain';
import { UserModel } from '../../models';
import { ReadModelUsersRepository } from '../../ports';
import { ExceptionBase } from '@goran/common';

@QueryHandler(FindOneUserByEmailQuery)
export class FindOneUserByEmailQueryHandler
  implements
    IQueryHandler<
      FindOneUserByEmailQuery,
      Result<UserModel, ExceptionBase>
    >
{
  constructor(private readonly userRepo: ReadModelUsersRepository) {}

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
