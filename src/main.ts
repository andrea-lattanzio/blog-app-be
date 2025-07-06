import { writeFileSync } from 'fs';

import type { OpenAPIObject } from '@nestjs/swagger';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { PrismaExceptionsFilter } from './shared/exception-filters/PrismaExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors();
  app.use(helmet({ contentSecurityPolicy: false }));

  app.useGlobalFilters(new PrismaExceptionsFilter());

  const swaggerConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Blog-app API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDoc: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    {
      deepScanRoutes: true,
    },
  );
  SwaggerModule.setup('api/swagger', app, swaggerDoc);
  writeFileSync(
    './openapi/openapi.spec.json',
    JSON.stringify(swaggerDoc, null, 2),
    { encoding: 'utf8' },
  );

  const port: number = configService.get<number>('server.port') || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
