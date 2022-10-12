import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  const port = process.env.PORT || 3333;
  await app.listen(port, '192.168.1.137', () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

console.log('#> __dirname: ', __dirname);
bootstrap();
