import { Module } from '@nestjs/common';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';
import { NewsletterSubscriptionController } from './newsletter-subscription.controller';
import { DatabaseModule } from 'src/config/database/database.module';
import { MailSenderModule } from 'src/mailer/mailer.module';

@Module({
  imports: [DatabaseModule, MailSenderModule],
  controllers: [NewsletterSubscriptionController],
  providers: [NewsletterSubscriptionService],
})
export class NewsletterSubscriptionModule {}
