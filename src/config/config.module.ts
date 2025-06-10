import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import configuration from './env.configuration';
import { validate } from './env.validation';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
    }),
  ],
})
export class ConfigModule {}
