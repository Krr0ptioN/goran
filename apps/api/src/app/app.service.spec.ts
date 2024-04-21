import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('Healthy Status', () => {
    it('should return "Hello API"', () => {
      expect(service.getHealthStatus()).toEqual({ health: 'ok' });
    });
  });
});
