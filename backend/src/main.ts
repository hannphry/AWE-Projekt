import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //await app.listen(PORT, '0.0.0.0');
  await app.listen(PORT);
}
bootstrap();