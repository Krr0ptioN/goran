import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import { FindOneUserByIdQuery } from './findone-user-by-id.query';
import { Option } from 'oxide.ts';
import { UserModel } from '../../models';
import { ReadModelUsersRepository } from '../../ports';

@QueryHandler(FindOneUserByIdQuery)
export class FindOneUserByIdQueryHandler
  implements IQueryHandler<FindOneUserByIdQuery, Option<UserModel>>
{
  constructor(private readonly userRepo: ReadModelUsersRepository) {}

  async execute(query: FindOneUserByIdQuery): Promise<Option<UserModel>> {
    return this.userRepo.findOneById(query.id);
  }
}
