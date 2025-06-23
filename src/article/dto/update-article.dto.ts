import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

/**
 * These classes are used to validate the incoming data when executing a nested updated on an article.
 */

export class UpdateCodeSectionDto {
  @IsUUID()
  id: string;
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
  @IsUUID()
  id: string;
  @IsOptional()
  @IsString()
  text?: string;
  @ValidateNested({ each: true })
  @Type(() => UpdateCodeSectionDto)
  codeSections: UpdateCodeSectionDto[];
}

export class UpdateChapterDto {
  @IsUUID()
  id: string;
  @IsOptional()
  @IsString()
  @Length(5, 50)
  title?: string;
  @ValidateNested({ each: true })
  @Type(() => UpdateParagraphDto)
  paragraphs: UpdateParagraphDto[];
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
  @IsOptional()
  @IsNumber()
  likes?: number;
  @ValidateNested({ each: true })
  @Type(() => UpdateChapterDto)
  chapters?: UpdateChapterDto[];
}
