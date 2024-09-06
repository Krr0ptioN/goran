import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';

/**
 * Registers global pipes and interceptors, plus server conifguration
 *
 * @param app - Nestjs application object
 * @returns Modified and configured nestjs application object and certain parameters
 */
export async function registerGlobals(app: INestApplication) {
    const globalPrefix = 'api';
    app.enableCors();
    app.setGlobalPrefix(globalPrefix);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector))
    );

    return { app, globalPrefix };
}
