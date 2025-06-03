import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateNewsletterSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
