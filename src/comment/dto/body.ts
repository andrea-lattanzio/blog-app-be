import { Comment } from '@prisma/client';
import { Exclude, plainToInstance, Type } from 'class-transformer';

type FullComment = Comment & { replies?: Comment[] };

export class CommentDto {
  id: string;
  text: string;
  author: string;
  createdAt: string;

  @Exclude()
  updatedAt: string;
  @Exclude()
  parentId?: string;
  @Exclude()
  userId: string;
  @Type(() => CommentDto)
  replies: Comment[];

  constructor(partial: Partial<FullComment>) {
    Object.assign(this, plainToInstance(CommentDto, partial));
  }

  static fromEntities(comments: FullComment[]): CommentDto[] {
    return comments.map((comment: FullComment) => new CommentDto(comment));
  }
}
