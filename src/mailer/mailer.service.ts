import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailSenderService {
    constructor(
        private readonly mailerSrv: MailerService
    ) {}
}
