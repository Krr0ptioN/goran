import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CONFIG_APP } from '@goran/config';
import { AppModule } from './app/app.module';
import { registerGlobals } from './globals';
import { setupSwagger } from './swagger';
import { goranBanner } from '@goran/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('BOOTSTRAP');
  const port = process.env[CONFIG_APP.SERVER_PORT] || 3000;

  const { globalPrefix } = await registerGlobals(app);
  setupSwagger(app);

  logger.log(goranBanner);
  logger.log(
    `  Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  logger.log(
    `  Documentation is running on: http://localhost:${port}/${globalPrefix}/docs`
  );

  await app.listen(port);
}

bootstrap();
