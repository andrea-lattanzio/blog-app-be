import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { NewsletterSubscription } from '@prisma/client';
import { Public } from 'src/shared/decorators/public.decorator';

import { NewsletterSubscriptionDto } from './dto/newsletter-subscription.dto';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';

@Public()
@Controller('newsletter-subscription')
export class NewsletterSubscriptionController {
  constructor(private readonly newsletterSubscriptionService: NewsletterSubscriptionService) { }

  @Post()
  @ApiOperation({
    summary: 'Subscribe to newsletter',
    description:
      'This endpoint subscribes user to newsletter',
  })
  async create(@Body() newsletterSub: NewsletterSubscriptionDto): Promise<NewsletterSubscription> {
    return this.newsletterSubscriptionService.create(newsletterSub);
  }

  @Patch()
  @ApiOperation({
    summary: 'Unsubscribe from newsletter',
    description:
      'This endpoint unsubscribe user from newsletter',
  })
  async disable(@Body() newsletterSub: NewsletterSubscriptionDto): Promise<NewsletterSubscription> {
    return this.newsletterSubscriptionService.disable(newsletterSub);
  }
}
