import { Injectable } from '@nestjs/common';
import {
  FindAllUsersPaginatedQuery,
  FindOneUserByEmailQuery,
  FindOneUserByIdQuery,
  FindOneUserByUsernameQuery,
} from '../queries';
import { UserDto, UserModel } from '../models';
import { UserMapper } from '../mappers';
import {
  ChangeUserEmailCommand,
  ChangeUserPasswordCommand,
  ChangeUserUsernameCommand,
  CreateUserCommand,
  DeleteUserCommand,
} from '../commands';
import {
  UserNotFoundError,
  ProvideUsernameOrEmailError,
  UserEntity,
} from '../../domain';
import { ExceptionBase } from '@goran/common';
import { Err, Ok, Option, Result } from 'oxide.ts';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class UsersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly mapper: UserMapper
  ) { }

  async changeEmail(userDto: UserModel, newEmail: string) {
    const user = this.mapper.toDomain(userDto);
    return await this.commandBus.execute(
      new ChangeUserEmailCommand({ user, newEmail })
    );
  }

  async changePassword(userDto: UserModel, newHashedPassword: string) {
    const user = this.mapper.toDomain(userDto);
    return await this.commandBus.execute(
      new ChangeUserPasswordCommand({ user, newHashedPassword })
    );
  }

  async changeUsername(userDto: UserModel, newUsername: string) {
    const user = this.mapper.toDomain(userDto);
    return await this.commandBus.execute(
      new ChangeUserUsernameCommand({ user, newUsername })
    );
  }

  async create(userDto: UserDto) {
    return await this.commandBus.execute(new CreateUserCommand(userDto));
  }

  async findAllPaginated(query: FindAllUsersPaginatedQuery) {
    return await this.queryBus.execute(query);
  }

  async findOneByEmail(email: string) {
    return await this.queryBus.execute(new FindOneUserByEmailQuery(email));
  }

  async findOneByUsername(username: string) {
    return await this.queryBus.execute(new FindOneUserByUsernameQuery(username));
  }

  async findUserByIdenfitier({
    username,
    email,
  }: {
    username?: string;
    email?: string;
  }): Promise<Result<UserEntity, ExceptionBase>> {
    let foundedUser: Option<UserEntity>;
    if (email) {
      foundedUser = await this.findOneByEmail(email);
    } else if (username) {
      foundedUser = await this.findOneByUsername(username);
    } else {
      return Err(new ProvideUsernameOrEmailError());
    }

    if (foundedUser.isSome()) {
      return Ok(foundedUser.unwrap());
    } else {
      return Err(new UserNotFoundError());
    }
  }

  async findOneById(id: string) {
    return await this.queryBus.execute(new FindOneUserByIdQuery(id));
  }

  async delete(command: DeleteUserCommand) {
    return await this.commandBus.execute(command);
  }
}
