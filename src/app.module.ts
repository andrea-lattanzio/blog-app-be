import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './shared/guards/jwt.guard';
import { AuthModule } from './identity/auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { NewsletterSubscriptionModule } from './newsletter-subscription/newsletter-subscription.module';
import mailerModuleConfig from './config/modules-imports-config/mailer.config';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    ArticleModule,
    AuthModule,
    CommentModule,
    MailerModule.forRootAsync(mailerModuleConfig),
    NewsletterSubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
