import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { DatabaseService } from 'src/config/database/database.service';
import { createChapters } from './utils/article.create.helpers';
import { ArticleDto } from './dto/body';
import { fullArticle } from './utils/article.query';
import { UpdateArticleDto } from './dto/update-article.dto';
import { updateChapters } from './utils/article.update.helpers';
import { ArticleQueryDto } from './dto/article.query.dto';
import { Article, Prisma } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: DatabaseService) {}

  /**
   *
   * @param createArticleDto Article info (including related entities).
   * @returns The newly created article, transformed into ArticleDto class.
   */
  async create(
    userId: string,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleDto> {
    const { chapters } = createArticleDto;
    const createdArticle = await this.prisma.article.create({
      data: {
        ...createArticleDto,
        userId,
        chapters: { create: createChapters(chapters) },
      },
    });
    return new ArticleDto(createdArticle);
  }

  /**
   *
   * @returns A list of all articles, transformed into ArticleDto class.
   */
  async findAll(findArticleDto: ArticleQueryDto): Promise<ArticleDto[]> {
    const { page, size, tag, titleContains, sortBy } = findArticleDto;
    const query: Prisma.ArticleFindManyArgs = {
      where: {},
      orderBy: {},
      skip: ((page - 1) * size) | 0,
      take: size || 10,
    };

    if (tag) {
      query.where.tag = tag;
    }

    if (titleContains) {
      query.where.title = {
        contains: titleContains,
        mode: 'insensitive',
      };
    }

    if (sortBy) {
      if (sortBy === 'views') {
        query.orderBy = {
          views: 'desc',
        };
      }
    } else {
      query.orderBy = {
        createdAt: 'asc',
      };
    }

    const articles = await this.prisma.article.findMany(query);
    return ArticleDto.fromEntities(articles);
  }

  async count(findArticleDto: ArticleQueryDto): Promise<number> {
    return this.prisma.article.count({
      where: {
        tag: findArticleDto.tag,
      },
    });
  }

  /**
   *
   * @returns The latest three articles ordered by creation date
   */
  async getLatestThree(): Promise<ArticleDto[]> {
    const articles = await this.prisma.article.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    return ArticleDto.fromEntities(articles);
  }

  /**
   *
   * @param articleId The article id.
   * @returns A single article along with all the related entities.
   */
  async findOne(articleId: string): Promise<ArticleDto> {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { id: articleId },
      include: fullArticle.include,
    });
    this.updateViews(articleId);
    return new ArticleDto(article);
  }

  private async updateViews(articleId: string) {
    await this.prisma.article.update({
      where: { id: articleId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  /**
   *
   * @param id The article id.
   * @param updateArticleDto The updated article info.
   * @returns The updated article, transformed into ArticleDto class.
   */
  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const { chapters, ...articleData } = updateArticleDto;
    const updatedArticle = await this.prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        chapters: { update: updateChapters(updateArticleDto.chapters) },
      },
    });
    return new ArticleDto(updatedArticle);
  }

  /**
   *
   * @param id The article id.
   * @returns The deleted article.
   */
  async remove(id: string): Promise<ArticleDto> {
    const deletedArticle = await this.prisma.article.delete({ where: { id } });
    return new ArticleDto(deletedArticle);
  }
}
