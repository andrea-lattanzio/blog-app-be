import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

export interface MailOptions<TContext = any> {
  subject: string;
  context: TContext;
  template: string;
  attachments?: any[];
}

const ASSETS_BASE_PATH = join(__dirname, '..', '..', 'assets');

@Injectable()
export class MailSenderService {
  constructor(private readonly mailerSrv: MailerService) {}

  send<TContext>(
    usersToNotify: string[],
    options: MailOptions<TContext>,
  ): void {
    const defaultAttachments = [
      {
        filename: 'header-image.png',
        path: join(ASSETS_BASE_PATH, 'header-image.png'),
        cid: 'header-image',
      },
    ];

    const attachments = options.attachments
      ? [...defaultAttachments, ...options.attachments]
      : defaultAttachments;

    usersToNotify.forEach((email) => {
      this.mailerSrv.sendMail({
        from: 'Andrea Lattanzio <andrealattanziodedona@gmail.com>',
        to: email,
        subject: options.subject,
        context: options.context,
        template: options.template,
        attachments: attachments,
      });
    });
  }
}
