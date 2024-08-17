import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOkResponse()
  @Get('health')
  getHealth() {
    return this.appService.getHealthStatus();
  }

  @ApiOkResponse()
  @Get()
  getData() {
    return this.appService.getData();
  }
}
