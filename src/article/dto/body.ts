import { Article, Chapter } from '@prisma/client';
import { Exclude, plainToInstance, Type } from 'class-transformer';

type FullArticle = Article & { chapters?: Chapter[] };

class CodeSectionDto {
  id: string;
  language: string;
  code: string;
  caption?: string;
  paragraphId: string;
}

class ParagraphDto {
  id: string;
  text: string;
  style?: string;
  chapterId: string;

  codeSections: CodeSectionDto[];
}

class ChapterDto {
  id: string;
  title: string;
  articleId: string;

  @Type(() => ParagraphDto)
  paragraphs: ParagraphDto[];
}

export class ArticleDto {
  id: string;
  title: string;
  description: string;
  author: string;

  @Exclude()
  createdAt: string;
  @Exclude()
  updatedAt: string;

  @Type(() => ChapterDto)
  chapters: ChapterDto;

  constructor(partial: Partial<FullArticle>) {
    Object.assign(this, plainToInstance(ArticleDto, partial));
  }

  static fromEntities(articles: FullArticle[]): ArticleDto[] {
    return articles.map((article: FullArticle) => new ArticleDto(article));
  }
}
