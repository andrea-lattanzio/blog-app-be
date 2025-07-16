import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsUUID()
  articleId?: string;

  @IsOptional()
  @IsUUID()
  parentCommentId?: string | undefined;

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  text: string;
}

