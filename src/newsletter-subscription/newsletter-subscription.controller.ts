import { Controller, Post, Body, Patch } from '@nestjs/common';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter-subscription.dto';
import { UpdateNewsletterSubscriptionDto } from './dto/update-newsletter-subscription.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiOperation } from '@nestjs/swagger';

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
  create(@Body() createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto) {
    return this.newsletterSubscriptionService.create(createNewsletterSubscriptionDto);
  }

  @Patch()
  @ApiOperation({
    summary: 'Unsubscribe from newsletter',
    description:
      'This endpoint unsubscribe user from newsletter',
  })
  disable(@Body() updateNewsletterSubscriptionDto: UpdateNewsletterSubscriptionDto) {
    return this.newsletterSubscriptionService.disable(updateNewsletterSubscriptionDto);
  }
}
