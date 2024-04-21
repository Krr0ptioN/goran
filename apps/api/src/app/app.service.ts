import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus(): { health: string } {
    return { health: 'ok' };
  }
}
