import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCodeSectionDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  caption?: string;
}

export class CreateParagraphDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCodeSectionDto)
  codeSections: CreateCodeSectionDto[];
}

export class CreateChapterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateParagraphDto)
  paragraphs: CreateParagraphDto[];
}

export enum ArticleTag {
  angular,
  react,
  node,
}

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ArticleTag, { message: 'Tag must be either angular react or node' })
  tag: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChapterDto)
  chapters: CreateChapterDto[];
}
