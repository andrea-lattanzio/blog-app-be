import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  articleID: string;

  @IsOptional()
  @IsUUID()
  parentId?: string | undefined;

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  text: string;
}


export class CreateReplyDto {
  @IsUUID()
  articleID: string;

  @IsUUID()
  parentId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  text: string;
}



