import { writeFileSync } from 'fs';

import type { NestExpressApplication } from '@nestjs/platform-express';
import type { OpenAPIObject } from '@nestjs/swagger';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { isDefined } from 'class-validator';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { PrismaExceptionsFilter } from './shared/exception-filters/PrismaExceptionFilter';

async function bootstrap(): Promise<void> {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix('/api');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
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

  const envPort: number | undefined = configService.get<number>('server.port');
  if (!isDefined(envPort)) { throw new Error('port is not defined'); }
  const port: number = envPort || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

bootstrap().catch((error: unknown) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});
