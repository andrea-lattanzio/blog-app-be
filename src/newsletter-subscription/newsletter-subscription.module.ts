import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';
import { MailSenderModule } from 'src/mailer/mailer.module';

import { NewsletterSubscriptionController } from './newsletter-subscription.controller';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';

@Module({
  imports: [DatabaseModule, MailSenderModule],
  controllers: [NewsletterSubscriptionController],
  providers: [NewsletterSubscriptionService],
})
export class NewsletterSubscriptionModule {}
