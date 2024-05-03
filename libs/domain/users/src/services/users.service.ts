import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto, CreateUserDto } from '../dto';
import { USERS_REPOSITORY, UsersRepository } from '../repositories';
import { UserEntityInfo } from '../entities';

@Injectable()
export class UsersService {
  constructor(@Inject(USERS_REPOSITORY) readonly userRepo: UsersRepository) {}

  changePassword(hashedNewPassword: string, { id }: Partial<UserEntityInfo>) {
    if (id) {
      this.update(id, { password: hashedNewPassword });
    } else {
      throw new BadRequestException(
        'User ID is necessary to proceed this operation'
      );
    }
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepo.create(createUserDto);
  }

  findAll() {
    return this.userRepo.findAll();
  }

  async findOne(user: Partial<UserEntityInfo>) {
    return await this.userRepo.findOne(user);
  }

  findOneById(id: number) {
    return this.userRepo.findOneById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  delete(user: Partial<UserEntityInfo>) {
    return this.userRepo.delete(user);
  }
}
