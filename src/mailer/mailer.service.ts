import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailOptions } from './mail.utils';

@Injectable()
export class MailSenderService {
  constructor(private readonly mailerSrv: MailerService) {}

  send<TContext>(
    usersToNotify: string[],
    options: MailOptions<TContext>,
  ): void {
    usersToNotify.forEach((email) => {
      this.mailerSrv.sendMail({
        from: 'Andrea Lattanzio <andrealattanziodedona@gmail.com>',
        to: email,
        subject: options.subject,
        context: options.context,
        template: options.template,
        attachments: options.attachments,
      });
    });
  }
}
