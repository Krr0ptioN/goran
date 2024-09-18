import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

/**
 * Registers global pipes and interceptors, plus server conifguration
 *
 * @param app - Nestjs application object
 * @returns Modified and configured nestjs application object and certain parameters
 */
export async function registerGlobals(
    app: INestApplication,
    globalPrefix: string
) {
    app.enableCors();
    app.setGlobalPrefix(globalPrefix);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector))
    );
}
