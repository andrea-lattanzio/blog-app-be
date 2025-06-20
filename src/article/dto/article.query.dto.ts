import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ArticleTag } from './create-article.dto';
import { PaginationQueryDto } from 'src/shared/presenter/pagination.dto';

export class ArticleQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ArticleTag, { message: 'Tag must be either Angular React or Node' })
  tag: string;

  @IsOptional()
  @IsString()
  @IsIn(['best', 'mostRecent', 'mostSeen'])
  sortBy?: 'best' | 'mostRecent' | 'mostSeen';

  @IsOptional()
  @IsString()
  titleContains?: string;
}
