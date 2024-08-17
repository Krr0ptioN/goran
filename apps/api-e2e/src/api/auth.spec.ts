import { USERS_REPOSITORY } from '@goran/users';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

/* eslint-disable @nx/enforce-module-boundaries */
import { AppModule } from 'apps/api/src/app/app.module';
import { MockUsersRepository } from 'libs/domain/users/src/repositories/user-mock.repository';
/* eslint-enable @nx/enforce-module-boundaries */

import request from 'supertest';

const user = {
    email: 'rogan@goran.com',
    username: 'rogan',
    fullname: 'Joe Rogan',
    password: 'JoeR0gan',
};

describe('Authentication /api/auth', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(USERS_REPOSITORY)
            .useClass(MockUsersRepository)
            .compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    test(`User registeration`, async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send(user);
        expect(res.body.data.tokens).toBeDefined();
        expect(res.body.data.user.email).toEqual(user.email);
        expect(res.body.data.user.username).toEqual(user.username);
        expect(res.body.data.user.password).not.toBeDefined();
        expect(res.status).toEqual(201);
    });

    it(`should not signup user with weak password`, async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ ...user, password: 'weakpass' });
        expect(res.body.error).toMatch('Bad Request');
        expect(res.body.message).toEqual([
            'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
        ]);
        expect(res.body.statusCode).toEqual(400);
    });

    it(`login using email`, async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({ email: user.email, password: user.password });
        expect(res.body.data.tokens).toBeDefined();
        expect(res.body.data.user.email).toEqual(user.email);
        expect(res.body.data.user.username).toEqual(user.username);
        expect(res.body.data.user.password).not.toBeDefined();
        expect(res.status).toEqual(201);
    });

    it(`login using username`, async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({ username: user.username, password: user.password });
        expect(res.body.data.tokens).toBeDefined();
        expect(res.body.data.user.email).toEqual(user.email);
        expect(res.body.data.user.username).toEqual(user.username);
        expect(res.body.data.user.password).not.toBeDefined();
        expect(res.status).toEqual(201);
    });

    it(`should not login with invalid password`, async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signin')
            .send({ email: user.email, password: user.password + 'invalid' });
        expect(res.body.error).toBeDefined();
        expect(res.body.message).toEqual(
            'User not found or the provided credential is invalid.'
        );
        expect(res.status).toEqual(400);
    });

    afterAll(async () => {
        await app.close();
    });
});
