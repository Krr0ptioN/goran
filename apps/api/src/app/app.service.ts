import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus(): { status: string } {
    return { status: 'ok' };
  }
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
