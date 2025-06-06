import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailOptions } from './mail.utils';
import { ConfigService } from '@nestjs/config';

export interface baseEmailContext {
  frontendBaseUri: string;
}

@Injectable()
export class MailSenderService {
  private readonly frontendBaseUri: string = '';

  constructor(
    private readonly mailerSrv: MailerService,
    private readonly configSrv: ConfigService,
  ) {
    this.frontendBaseUri = this.configSrv.get<string>('FRONTEND_BASE_URI');
  }

  send<TContext>(
    usersToNotify: string[],
    options: MailOptions<TContext>,
  ): void {
    const context = options.context
      ? { ...options.context, frontendBaseUri: this.frontendBaseUri }
      : { frontendBaseUri: this.frontendBaseUri };

    usersToNotify.forEach((email) => {
      this.mailerSrv.sendMail({
        from: 'Andrea Lattanzio <andrealattanziodedona@gmail.com>',
        to: email,
        subject: options.subject,
        context: context,
        template: options.template,
        attachments: options.attachments,
      });
    });
  }
}
