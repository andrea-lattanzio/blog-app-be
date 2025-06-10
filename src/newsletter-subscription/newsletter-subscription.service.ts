import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter-subscription.dto';
import { UpdateNewsletterSubscriptionDto } from './dto/update-newsletter-subscription.dto';
import { DatabaseService } from 'src/config/database/database.service';
import { NewsletterSubscription } from '@prisma/client';
import { baseEmailContext, MailSenderService } from 'src/mailer/mailer.service';
import { MailOptions } from 'src/mailer/mail.utils';

@Injectable()
export class NewsletterSubscriptionService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly mailer: MailSenderService,
  ) {}

  /**
   * Receives the email and creates a subscription
   * @param createNewsletterSubscriptionDto receives an email
   * @returns the newly created entity
   */
  async create(
    createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto,
  ): Promise<NewsletterSubscription> {
    const subscription = await this.prisma.newsletterSubscription.create({
      data: createNewsletterSubscriptionDto,
    });

    if (subscription) {
      const welcomeEmailOptions: MailOptions<baseEmailContext> = {
        subject: 'Newsletter subscription confirmed.',
        template: 'welcome',
      };

      this.mailer.send(
        [createNewsletterSubscriptionDto.email],
        welcomeEmailOptions,
      );
    } else {
      throw new BadRequestException('error');
    }

    return subscription;
  }

  /**
   *
   * @param id
   * @param updateNewsletterSubscriptionDto
   * @returns
   */
  async disable(
    updateNewsletterSubscriptionDto: UpdateNewsletterSubscriptionDto,
  ): Promise<NewsletterSubscription> {
    return this.prisma.newsletterSubscription.update({
      where: { email: updateNewsletterSubscriptionDto.email },
      data: { is_active: false },
    });
  }
}
