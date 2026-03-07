import express = require('express');
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import { AppModule } from './app/app.module';
import appConfig from './app/app.config';
import { registerGlobals, setupSwagger } from './bootstrap';

let cachedServer: express.Express | null = null;

async function createServer() {
    const server = express();
    const app = await NestFactory.create(
        AppModule.register(appConfig()),
        new ExpressAdapter(server),
        { bufferLogs: true },
    );

    await registerGlobals(app, 'api');
    setupSwagger(app);
    await app.init();

    return server;
}

export default async function handler(req: Request, res: Response) {
    if (!cachedServer) {
        cachedServer = await createServer();
    }

    const server = cachedServer;
    return server(req, res);
}
