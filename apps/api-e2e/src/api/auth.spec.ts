import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

/* eslint-disable @nx/enforce-module-boundaries */
import { AppModule } from 'apps/api/src/app/app.module';
/* eslint-enable @nx/enforce-module-boundaries */

import request from 'supertest';

const user = {
  email: 'joe.rogan@goran.com',
  username: 'joerogan',
  fullname: 'Joe Rogan',
  password: 'joeStr01ngP4',
};

describe('Authentication /api/auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  /* TEST: Signup new user
   * */
  test(`User registeration`, async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user);
    console.log(res);
    expect(res).toBeDefined();
  });

  /* TEST: Signin new user
   * */

  it(`User login`, () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: user.email, password: user.password })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
