import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
