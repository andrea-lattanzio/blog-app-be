import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ArticleTag } from './create-article.dto';
import { PaginationQueryDto } from 'src/shared/presenter/pagination.dto';

export class ArticleQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ArticleTag, { message: 'Tag must be either Angular React or Node' })
  tag: string;
}
