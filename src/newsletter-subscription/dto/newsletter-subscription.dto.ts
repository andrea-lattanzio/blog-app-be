import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewsletterSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
