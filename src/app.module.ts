import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ArticleModule } from './article/article.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './shared/guards/jwt.guard';
import { AuthModule } from './identity/auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { NewsletterSubscriptionModule } from './newsletter-subscription/newsletter-subscription.module';
import mailerModuleConfig from './config/modules-imports-config/mailer.config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: getEnvPath() }),
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

function getEnvPath(): string {
  const configService = new ConfigService();
  const env: string = configService.get<string>('NODE_ENV') || 'development';
  return join(`.env.${env}`);
}
