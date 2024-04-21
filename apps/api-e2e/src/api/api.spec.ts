import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

/* eslint-disable @nx/enforce-module-boundaries */
import { AppModule } from 'apps/api/src/app/app.module';
/* eslint-enable @nx/enforce-module-boundaries */

import request from 'supertest';

describe('/api', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`GET /api`, () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ message: 'Hello API' });
  });

  it(`GET /api/heath`, () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  afterAll(async () => {
    await app.close();
  });
});
