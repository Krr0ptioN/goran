import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity, UserEntityInfo } from '../entities';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { QueryEntityReturn } from '@goran/types';

@Injectable()
export class UsersServiceMock implements Omit<UsersService, 'userRepo'> {
  public users: UserEntity[] = [];

  create(createUserDto: CreateUserDto) {
    const id = this.users.length;
    this.users.push({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: this.users.length,
    });
    return this.users[id];
  }

  findOne(target: Partial<UserEntityInfo>) {
    const result = this.users.find(
      (user) =>
        user.id === target.id ||
        user.username === target.username ||
        user.email === target.email
    );

    return result ? result : null;
  }

  findAll(): QueryEntityReturn<UserEntity> {
    return this.users;
  }

  async findOneById(targetId: number) {
    const result = this.users.find((user) => user.id === targetId);
    if (result) return result;
    else return null;
  }

  async update(id: number, value: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return null;
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...value,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  async delete(target: Partial<UserEntityInfo>): Promise<UserEntity | null> {
    const userIndex = this.users.findIndex((user) => {
      return (
        (target.id !== undefined && user.id === target.id) ||
        (target.username !== undefined && user.username === target.username) ||
        (target.email !== undefined && user.email === target.email)
      );
    });

    if (userIndex === -1) {
      return null;
    }

    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);

    return deletedUser;
  }

  changePassword(
    hashedNewPassword: string,
    { id }: Partial<UserEntityInfo>
  ): void {
    if (id) this.users[id].password = hashedNewPassword;
  }
}
