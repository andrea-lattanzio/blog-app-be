import type { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

const mailerModuleConfig: MailerAsyncOptions = {
  imports: [ConfigModule],
  /* eslint-disable @typescript-eslint/require-await */
  useFactory: async (configService: ConfigService) => ({
    transport: {
      host: configService.get<string>('mail.host'),
      auth: {
        user: configService.get<string>('mail.user'),
        pass: configService.get<string>('mail.pass'),
      },
    },
    template: {
      dir: __dirname + '../../../mail-templates',
      adapter: new PugAdapter({ inlineCssEnabled: true }),
      options: {
        strict: false,
      },
    },
  }),
  inject: [ConfigService],
};

export default mailerModuleConfig;
