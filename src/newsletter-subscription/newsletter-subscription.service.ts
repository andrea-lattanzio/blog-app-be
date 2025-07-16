import { Injectable } from '@nestjs/common';
import { NewsletterSubscription } from '@prisma/client';
import { DatabaseService } from 'src/config/database/database.service';
import { BaseMailContext, MailOptions } from 'src/mailer/mail.utils';
import { MailSenderService } from 'src/mailer/mailer.service';

import { NewsletterSubscriptionDto } from './dto/newsletter-subscription.dto';

@Injectable()
export class NewsletterSubscriptionService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly mailer: MailSenderService,
  ) { }

  /**
   * Receives the email and creates a subscription
   * @param createNewsletterSubscriptionDto receives an email
   * @returns the newly created entity
   */
  async create(
    createNewsletterSubscriptionDto: NewsletterSubscriptionDto,
  ): Promise<NewsletterSubscription> {
    const subscription: NewsletterSubscription = await this.prisma.newsletterSubscription.create({
      data: createNewsletterSubscriptionDto,
    });

    const welcomeEmailOptions: MailOptions<BaseMailContext> = {
      subject: 'Newsletter subscription confirmed.',
      template: 'welcome',
    };

    await this.mailer.send<BaseMailContext>(
      [createNewsletterSubscriptionDto.email],
      welcomeEmailOptions,
    );

    return subscription;
  }

  /**
   *
   * @param id
   * @param updateNewsletterSubscriptionDto
   * @returns
   */
  async disable(
    updateNewsletterSubscriptionDto: NewsletterSubscriptionDto,
  ): Promise<NewsletterSubscription> {
    return this.prisma.newsletterSubscription.update({
      where: { email: updateNewsletterSubscriptionDto.email },
      data: { isActive: false },
    });
  }
}
