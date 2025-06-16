import { ConfigModule, ConfigService } from '@nestjs/config';

const JwtModuleConfig = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('auth.secret'),
    signOptions: {
      expiresIn: parseInt(configService.getOrThrow<string>('auth.expiration')),
    },
  }),
  inject: [ConfigService],
};

export default JwtModuleConfig;
