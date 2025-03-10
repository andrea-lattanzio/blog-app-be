import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

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

  const port: number = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();
