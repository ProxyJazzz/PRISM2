import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation using class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // Enable CORS if the frontend needs it (assumed React integration)
  app.enableCors();
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
