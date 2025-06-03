import { Test, TestingModule } from '@nestjs/testing';
import { NewsletterSubscriptionService } from './newsletter-subscription.service';

describe('NewsletterSubscriptionService', () => {
  let service: NewsletterSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsletterSubscriptionService],
    }).compile();

    service = module.get<NewsletterSubscriptionService>(NewsletterSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
