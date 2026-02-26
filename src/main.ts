import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // Robust CORS configuration
  const frontendUrl = configService.get<string>('FRONTEND_URL');
  const origins: string[] = ["http://localhost:3000"];
  if (frontendUrl) {
    frontendUrl.split(',').forEach((url) => {
      // Sanitize: remove whitespace, quotes, and trailing slashes
      const sanitized = url.trim().replace(/^['"]|['"]$/g, '').replace(/\/$/, '');
      if (sanitized) {
        app.enableCors({
          origin: sanitized,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
        });
      }
    });
  }

  const allowedOrigins = Array.from(origins);
  logger.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });

  // Cookie parser middleware
  app.use(cookieParser());

  // Register Global Exception Filter
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get('PORT') || 3001;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Frontend url: ${configService.get("FRONTEND_URL")}`);
}

void bootstrap();
