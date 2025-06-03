import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterSubscriptionController } from './newsletter-subscription.controller';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';

describe('NewsletterSubscriptionController', () => {
  let controller: NewsletterSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsletterSubscriptionController],
      providers: [NewsletterSubscriptionService],
    }).compile();

    controller = module.get<NewsletterSubscriptionController>(NewsletterSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
