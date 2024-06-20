import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../../application/services';
import { UpdateUserDto, CreateUserDto } from './requests';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserCommand } from '../../application/commands/create-user/create-user.command';
import { SingleUserResponse } from './responses/single-user-info.dto';
import { UsersQueryResponse } from './responses/users-query.dto';

@ApiTags('users', 'entity')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    type: SingleUserResponse,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(
      new CreateUserCommand(
        createUserDto.username,
        createUserDto.email,
        createUserDto.password,
        createUserDto.fullname ? createUserDto.fullname : undefined
      )
    );

    if (createdUser) {
      return { data: createdUser };
    } else {
      throw new InternalServerErrorException('User creation procedure failed');
    }
  }

  @ApiOkResponse({
    type: UsersQueryResponse,
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOkResponse({
    type: SingleUserResponse,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id: +id });
  }

  @ApiOkResponse({
    type: SingleUserResponse,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOkResponse({
    type: SingleUserResponse,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete({ id: +id });
  }
}
