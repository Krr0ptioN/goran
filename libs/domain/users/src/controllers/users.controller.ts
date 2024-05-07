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
import { UsersService } from '../services';
import { UpdateUserDto, CreateUserDto } from '../dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntityInfo } from '../entities';

class SingleUserResponse {
  data: UserEntityInfo;
}

class UsersQueryResponse {
  data: UserEntityInfo[];
}

@ApiTags('users', 'entity')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOkResponse({
    type: SingleUserResponse,
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
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
