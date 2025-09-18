import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { error } from 'console';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   app.setGlobalPrefix('api/v1');
   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         forbidNonWhitelisted: true,
         transform: true,
      }),
   );

   await app.listen(process.env.PORT ?? 3000, () => {
      Logger.debug(`Server running on port ${process.env.PORT ?? 3000}`);
   });
}
bootstrap().catch(error);
