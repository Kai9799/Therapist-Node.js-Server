import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.use('/webhook', express.raw({ type: 'application/json' }));

  await app.listen(process.env.PORT ?? 9001);
}
bootstrap();
