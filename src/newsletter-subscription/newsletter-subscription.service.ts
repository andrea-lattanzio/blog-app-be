import { Injectable } from '@nestjs/common';
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter-subscription.dto';
import { UpdateNewsletterSubscriptionDto } from './dto/update-newsletter-subscription.dto';
import { DatabaseService } from 'src/config/database/database.service';
import { NewsletterSubscription } from '@prisma/client';

@Injectable()
export class NewsletterSubscriptionService {
  constructor(private readonly prisma: DatabaseService) {}

  /**
   * Receives the email and creates a subscription
   * @param createNewsletterSubscriptionDto receives an email
   * @returns the newly created entity
   */
  async create(
    createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto,
  ): Promise<NewsletterSubscription> {
    return await this.prisma.newsletterSubscription.create({
      data: createNewsletterSubscriptionDto,
    });
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
