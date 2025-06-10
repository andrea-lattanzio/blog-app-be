import { ConfigModule, ConfigService } from '@nestjs/config';

const JwtModuleConfig = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: parseInt(
        configService.getOrThrow<string>(
          'ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC',
        ),
      ),
    },
  }),
  inject: [ConfigService],
};

export default JwtModuleConfig;
