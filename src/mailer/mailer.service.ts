import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailOptions } from './mail.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailSenderService {
  private readonly frontendBaseUri: string = this.configSrv.get<string>('frontend.baseUri');

  constructor(
    private readonly mailerSrv: MailerService,
    private readonly configSrv: ConfigService,
  ) {}

  async send(
    usersToNotify: string[],
    options: MailOptions,
  ): Promise<void> {
    const context = options.context
      ? { ...options.context, frontendBaseUri: this.frontendBaseUri }
      : { frontendBaseUri: this.frontendBaseUri };

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
