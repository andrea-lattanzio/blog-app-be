import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

const mailerModuleConfig = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('EMAIL_HOST'),
      auth: {
        user: configService.get<string>('EMAIL_USERNAME'),
        pass: configService.get<string>('EMAIL_PASSWORD'),
      },
    },
    template: {
      dir: __dirname + '/mail-templates',
      adapter: new PugAdapter({ inlineCssEnabled: true }),
      options: {
        strict: false,
      },
    },
  }),
  inject: [ConfigService],
};

export default mailerModuleConfig;
