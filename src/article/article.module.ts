import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { DatabaseService } from 'src/config/database/database.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, DatabaseService],
})
export class ArticleModule {}
