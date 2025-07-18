import {
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

/**
 * These classes are used to validate the incoming data when executing a nested updated on an article.
 */

export class UpdateCodeSectionDto {
  @IsOptional()
  @IsString()
  language?: string;
  @IsOptional()
  @IsString()
  code?: string;
  @IsOptional()
  @IsString()
  @Length(5, 20)
  caption?: string;
}

export class UpdateParagraphDto {
  @IsOptional()
  @IsString()
  text?: string;
}

export class UpdateChapterDto {
  @IsOptional()
  @IsString()
  @Length(5, 50)
  title?: string;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  @Length(5, 50)
  title?: string;
  @IsOptional()
  @IsString()
  @Length(10, 200)
  description?: string;
}
