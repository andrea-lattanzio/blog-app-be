import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ArticleTag } from './create-article.dto';
import { PaginationQueryDto } from 'src/shared/presenter/pagination.dto';

export class ArticleQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ArticleTag, { message: 'Tag must be either Angular React or Node' })
  tag: string;

  @IsOptional()
  @IsString()
  @IsIn(['views', 'createdAt'])
  sortBy?: 'views' | 'createdAt';

  @IsOptional()
  @IsString()
  titleContains?: string;
}
