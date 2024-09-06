import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CONFIG_APP } from '@goran/config';
import { AppModule } from './app/app.module';
import { setupSwagger, registerGlobals } from './bootstrap';
import { goranBanner } from '@goran/utils';
import appConfig from './app/app.config';

async function bootstrap() {
    const logger = new Logger('BOOTSTRAP');

    logger.log(goranBanner);

    const config = appConfig();
    const app = await NestFactory.create(AppModule.register(config));
    const port = process.env[CONFIG_APP.SERVER_PORT] || 3000;
    const { globalPrefix } = await registerGlobals(app);

    setupSwagger(app);

    logger.log(
        `  Application is running on: http://localhost:${config.port}/${globalPrefix}`
    );
    logger.log(
        `  Documentation is running on: http://localhost:${config.port}/docs`
    );

    await app.listen(port);
}

bootstrap();
