import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  it('should return "Hello API"', () => {
    const appController = app.get<AppController>(AppController);
    expect(appController.getData()).toEqual({ message: 'Hello API' });
  });

  it('health should be "ok"', () => {
    const appController = app.get<AppController>(AppController);
    expect(appController.getHealth()).toEqual({ status: 'ok' });
  });
});
