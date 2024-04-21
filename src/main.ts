import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'fatal', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Events API')
    .setDescription('Endpoints')
    .setVersion('0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000
  await app.listen(port, () =>{
    console.log("Running API in mode: ", process.env.NODE_ENV), " on PORT: ", process.env.PORT;
  });
}
bootstrap();
