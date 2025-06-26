import { Article, Chapter } from '@prisma/client';
import { Exclude, plainToInstance, Type } from 'class-transformer';

type FullArticle = Article & { chapters?: Chapter[] };

/**
 * Data transfer objects for the Article entity.
 * These classes are used to transform the data returned by the service layer
 * into more readable and client-friendly formats.
 * Unnecessary fields are excluded from the response.
 */

class CodeSectionDto {
  id: string;
  language: string;
  code: string;
  caption?: string;
  @Exclude()
  paragraphId: string;
}

class ParagraphDto {
  id: string;
  text: string;
  style?: string;
  @Exclude()
  chapterId: string;
  @Type(() => CodeSectionDto)
  codeSections: CodeSectionDto[];
}

class ChapterDto {
  id: string;
  title: string;
  @Exclude()
  articleId: string;
  @Type(() => ParagraphDto)
  paragraphs: ParagraphDto[];
}

export class ArticleDto {
  id: string;
  title: string;
  description: string;
  author: string;
  tag: string;
  updatedAt: string;
  _count: { likes: number };
  liked: boolean = false;

  @Exclude()
  createdAt: string;
  @Exclude()
  userId: string;
  
  @Type(() => ChapterDto)
  chapters: ChapterDto[];

  /**
   * The contructor method assigns the article entity to the ArticleDto class,
   * this triggers the object transformation that allows to remove unwanted fields.
   * Partial is needed as some service layer methods return Articles without related entities.
   * @param partial Partial data of the Article entity.
   */
  constructor(partial: Partial<FullArticle>) {
    Object.assign(this, plainToInstance(ArticleDto, partial));
  }

  /**
   * This static method is used in the service layer methods that return a list of articles.
   * @param articles A list of full article entities.
   * @returns The same list but transformed into ArticleDto objects.
   */
  static fromEntities(articles: FullArticle[]): ArticleDto[] {
    return articles.map((article: FullArticle) => new ArticleDto(article));
  }
}
