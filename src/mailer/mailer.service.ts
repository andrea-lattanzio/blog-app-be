import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { isStringDefined } from 'src/shared/utils/common';

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
    const frontendBaseUri: string | undefined = this.configSrv.get<string>('frontend.baseUri');
    let context: Partial<BaseMailContext> = { ...(options.context) };

    if (isStringDefined(frontendBaseUri)) {
      const baseContext: BaseMailContext = { frontendBaseUri: frontendBaseUri };
      context = { ...baseContext };
    }

    for (const email of usersToNotify) {
      await this.mailerSrv.sendMail({
        from: this.configSrv.get('mail.from'),
        to: email,
        subject: options.subject,
        context: context,
        template: options.template,
        attachments: options.attachments,
      });
    }
  }
}
