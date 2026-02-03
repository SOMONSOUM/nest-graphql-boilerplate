import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const node_env = configService.getOrThrow<string>('NODE_ENV');

  // Global validation pipe for request validation
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const messages = errors
          .flatMap((error) =>
            error.constraints ? Object.values(error.constraints) : [],
          )
          .map((msg) => msg.toUpperCase().replace(/\s+/g, '_'));
        return new BadRequestException({ messages, success: false });
      },
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
      disableErrorMessages: node_env === 'production',
    }),
  );

  const port = configService.get<number>('PORT') ?? 8080;

  await app.listen(port);
}
bootstrap();
