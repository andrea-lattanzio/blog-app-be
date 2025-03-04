import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DatabaseService } from 'src/config/database/database.service';
import { createChapters } from './utils/article.helpers';
import { ArticleDto } from './dto/body';
import { fullArticle } from './utils/article.query';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: DatabaseService) {}

  /**
   * 
   * @param createArticleDto Article info (including related entities).
   * @returns The newly created article, transformed into ArticleDto class.
   */
  async create(createArticleDto: CreateArticleDto): Promise<ArticleDto> {
    const { chapters } = createArticleDto;
    const createdArticle = await this.prisma.article.create({
      data: {
        ...createArticleDto,
        chapters: { create: createChapters(chapters) },
      },
    });
    return new ArticleDto(createdArticle);
  }

  /**
   * 
   * @returns A list of all articles, transformed into ArticleDto class.
   */
  async findAll(): Promise<ArticleDto[]> {
    const articles = await this.prisma.article.findMany();
    return ArticleDto.fromEntities(articles);
  }

  /**
   *
   * @param id The article id.
   * @returns A single article along with all the related entities.
   */
  async findOne(id: string): Promise<ArticleDto> {
    const article = await this.prisma.article.findUniqueOrThrow({
      where: { id },
      include: fullArticle.include,
    });
    return new ArticleDto(article);
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
