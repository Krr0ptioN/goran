import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('getData', () => {
    it('should return "ok"', () => {
      expect(appController).toBeDefined();
      expect(appController.getHealthStatus()).toEqual({ health: 'ok' });
    });
  });
});
