import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

@Injectable()
export class MailSenderService {
  constructor(private readonly mailerSrv: MailerService) {}

  send(email: string): void {
    this.mailerSrv.sendMail({
        from: "Andrea Lattanzio <andrealattanziodedona@gmail.com>",
        // to: email,
        to: "andrealattanziodedona@gmail.com",
        subject: "Welcome to my newsletter!",
        context: {
            email: email
        },
        template: "welcome",
        attachments: [{
            filename: 'header-image.png',
            path: join(__dirname, '..', '..', 'assets', 'header-image.png'),
            cid: 'header-image',
        }]
    });
  }
}
