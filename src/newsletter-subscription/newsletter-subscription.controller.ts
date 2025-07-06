import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';

import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter-subscription.dto';
import { UpdateNewsletterSubscriptionDto } from './dto/update-newsletter-subscription.dto';
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
  async create(@Body() createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto) {
    return this.newsletterSubscriptionService.create(createNewsletterSubscriptionDto);
  }

  @Patch()
  @ApiOperation({
    summary: 'Unsubscribe from newsletter',
    description:
      'This endpoint unsubscribe user from newsletter',
  })
  async disable(@Body() updateNewsletterSubscriptionDto: UpdateNewsletterSubscriptionDto) {
    return this.newsletterSubscriptionService.disable(updateNewsletterSubscriptionDto);
  }
}
