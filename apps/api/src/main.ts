import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CONFIG_APP } from '@goran/config';
import { AppModule } from './app/app.module';
import { setupSwagger, registerGlobals } from './bootstrap';
import { goranBanner } from '@goran/utils';
import appConfig from './app/app.config';

async function bootstrap() {
    const logger = new Logger('BOOTSTRAP');
    const globalPrefix = 'api';
    const port = process.env[CONFIG_APP.SERVER_PORT] || 3000;
    const config = appConfig();

    logger.log(
        goranBanner({
            appLink: `http://localhost:${config.port}/${globalPrefix}`,
            docsLink: `http://localhost:${config.port}/docs`,
        })
    );

    const app = await NestFactory.create(AppModule.register(config), {
        bufferLogs: true,
    });
    await registerGlobals(app, globalPrefix);

    setupSwagger(app);

    await app.listen(port);
}

bootstrap();
