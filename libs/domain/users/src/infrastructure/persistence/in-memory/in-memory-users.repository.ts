import { Injectable } from '@nestjs/common';
import {
  UserEntity,
  UserEntityInfo,
  UserEntityInfoQuery,
  UserEntityMutation,
} from '../entities';
import { UsersRepository } from './users.repository';
import { faker } from '@faker-js/faker';

@Injectable()
export class MockUsersRepository implements UsersRepository {
  constructor() {
    this.users = [this.generateMockUser()];
  }
  private users: UserEntity[] = [];

  generateMockUser() {
    const id = this.users.length;
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const fullname = faker.person.fullName();
    const createdAt = new Date();
    const updatedAt = new Date();

    return { id, username, email, password, fullname, createdAt, updatedAt };
  }

  get usersList() {
    return this.users;
  }

  findAll() {
    return this.users;
  }

  async findOne(target: UserEntityInfoQuery): Promise<UserEntity | null> {
    const result = this.users.find(
      (user) =>
        user.username === target.username ||
        user.email === target.email ||
        user.id === target.id
    );
    if (result) return result;
    else return null;
  }

  async findOneById(targetId: number) {
    const result = this.users.find((user) => user.id === targetId);
    if (result) return result;
    else return null;
  }

  async create(value: UserEntityMutation): Promise<UserEntity> {
    const id = this.users.length;
    this.users.push({
      ...value,
      id,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    return this.users[id];
  }

  async update(id: number, value: Partial<UserEntityMutation>) {
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
      return null; // User not found
    }

    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1); // Remove user from array

    return deletedUser;
  }
}
