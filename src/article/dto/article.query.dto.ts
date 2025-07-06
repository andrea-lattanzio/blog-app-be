import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/shared/presenter/pagination.dto';

import { ArticleTag } from './create-article.dto';

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
