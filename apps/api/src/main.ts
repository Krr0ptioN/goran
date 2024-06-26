import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { registerGlobals } from './globals';
import { setupSwagger } from './swagger';
import { goranBanner } from '@goran/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const { globalPrefix } = await registerGlobals(app);
  setupSwagger(app);

  await app.listen(port);

  Logger.log(goranBanner);
  Logger.log(
    `  Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `  Documentation is running on: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();
