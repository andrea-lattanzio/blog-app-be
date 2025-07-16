import { BadRequestException, Injectable } from '@nestjs/common';
import { Comment } from '@prisma/client';
import { DatabaseService } from 'src/config/database/database.service';
import { isDefined, isStringDefined } from 'src/shared/utils/common';

import { NO_SUBREPLY } from './constants/comment.constants';
import { CommentDto } from './dto/body';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: DatabaseService) { }

  /**
   * Creates a new comment with provided text and links the comment to the user who posted it.
   * If ArticleId is defined in the DTO a top level comment will be created.
   * If ParentCommentId is defind in the DTO a reply comment will be created.
   *
   * @param userId logged user id.
   * @param createCommentDto data.
   * @returns the newly created comment.
   */
  async create(userId: string, createCommentDto: CreateCommentDto): Promise<CommentDto> {
    const { parentCommentId, text, articleId } = createCommentDto;
    if (isStringDefined(parentCommentId)) await this.stopSubReply(parentCommentId);
    const createdComment: Comment = await this.prisma.comment.create({
      data: {
        text: text,
        author: { connect: { id: userId } },
        ...(isStringDefined(articleId) && {
          article: { connect: { id: articleId } },
        }),
        ...(isStringDefined(parentCommentId) && {
          parent: { connect: { id: parentCommentId } },
        }),
      },
    });

    return new CommentDto(createdComment);
  }

  /**
   * Finds a comment with the id that equals the provided parentId,
   * if the found comment has a parent it means that it is already a reply
   * in this case a BadRequestException is thrown.
   *
   * @param parentId parent comment id.
   */
  private async stopSubReply(parentId: string): Promise<void> {
    const parent: Comment | null = await this.prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (
      isDefined<Comment>(parent) &&
      isStringDefined(parent.parentId)
    ) throw new BadRequestException(NO_SUBREPLY);
  }

  /**
   * Finds all top level comments for an article.
   *
   * @param articleId the id of the article that needs the comments.
   * @returns the list of top level comments (no replies) for that article.
   */
  async findAll(articleId: string): Promise<CommentDto[]> {
    const comments: Comment[] = await this.prisma.comment.findMany({
      where: {
        articleId: articleId,
        parentId: null,
      },
    });

    return CommentDto.fromEntities(comments);
  }

  /**
   * Finds a single comment based on the provided id,
   * returns the comment details as well as the replies.
   * This method is called when i "expand" a comment.
   *
   * @param commentId the id of the comment i'm "expanding"
   * @returns the detailed comment and the replies
   */
  async findOne(commentId: string): Promise<CommentDto> {
    const comment: Comment = await this.prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
      include: { replies: true },
    });

    return new CommentDto(comment);
  }
}
