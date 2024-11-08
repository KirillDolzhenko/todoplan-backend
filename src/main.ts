import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = await app.get<ConfigService>(ConfigService);

  await app.enableCors();
  await app.listen(config.get('port.server'));

  console.log(config.get('port.server'));
}

bootstrap();
