import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  articleID: string;

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



