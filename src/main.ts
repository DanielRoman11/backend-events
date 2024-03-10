import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'fatal', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT || 3000
  await app.listen(port);
}
bootstrap();
