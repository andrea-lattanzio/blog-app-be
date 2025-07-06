import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { BaseMailContext, MailOptions } from './mail.utils';

@Injectable()
export class MailSenderService {
  constructor(
    private readonly mailerSrv: MailerService,
    private readonly configSrv: ConfigService,
  ) { }

  async send<T>(
    usersToNotify: string[],
    options: MailOptions<T>,
  ): Promise<void> {
    const baseContext: BaseMailContext = { frontendBaseUri: this.configSrv.get<string>('frontend.baseUri') };
    const context = { ...baseContext, ...(options.context || {}) };

    usersToNotify.forEach((email) => {
      this.mailerSrv.sendMail({
        from: this.configSrv.get('mail.from'),
        to: email,
        subject: options.subject,
        context: context,
        template: options.template,
        attachments: options.attachments,
      });
    });
  }
}
