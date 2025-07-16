import type { JwtModuleAsyncOptions } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';

const JwtModuleConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  /* eslint-disable @typescript-eslint/require-await */
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('auth.secret'),
    signOptions: {
      expiresIn: parseInt(configService.getOrThrow<string>('auth.expiration')),
    },
  }),
  inject: [ConfigService],
};

export default JwtModuleConfig;
