import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter-subscription.dto';
import { UpdateNewsletterSubscriptionDto } from './dto/update-newsletter-subscription.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@Public()
@Controller('newsletter-subscription')
export class NewsletterSubscriptionController {
  constructor(private readonly newsletterSubscriptionService: NewsletterSubscriptionService) {}

  @Post()
  create(@Body() createNewsletterSubscriptionDto: CreateNewsletterSubscriptionDto) {
    return this.newsletterSubscriptionService.create(createNewsletterSubscriptionDto);
  }

  @Patch()
  disable(@Body() updateNewsletterSubscriptionDto: UpdateNewsletterSubscriptionDto) {
    return this.newsletterSubscriptionService.disable(updateNewsletterSubscriptionDto);
  }
}
