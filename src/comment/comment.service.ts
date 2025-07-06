import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';

import { NO_SUBREPLY } from './constants/comment.constants';
import { CommentDto } from './dto/body';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: DatabaseService) {}

  /**
   * Creates a new comment and links it to the logged user who is commenting,
   * as well as to the article the user is commenting.
   *
   * If `parentId` is provided in the dto it means i am creating a reply,
   * in this scenario i need to check that the parent comment
   * is not a reply itself. (i cannot have multiple levels of replies).
   *
   * @param userId logged user id.
   * @param createCommentDto data.
   * @returns the newly created comment.
   */
  async create(userId: string, createCommentDto: CreateCommentDto) {
    if (createCommentDto.parentId) this.stopSubReply(createCommentDto.parentId);
    const createdComment = await this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        author: { connect: { id: userId } },
        // if articleId is provieded (meaning this is a top level comment) i connect comment to article
        ...(createCommentDto.articleId && {
          article: { connect: { id: createCommentDto.articleId } },
        }),
        // if a parent id is provided i connect the comment to its parent
        ...(createCommentDto.parentId && {
          parent: { connect: { id: createCommentDto.parentId } },
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
  private async stopSubReply(parentId: string) {
    const parent = await this.prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (parent.parentId) throw new BadRequestException(NO_SUBREPLY);
  }

  /**
   * Finds all top level comments for an article.
   *
   * @param articleId the id of the article that needs the comments.
   * @returns the list of top level comments (no replies) for that article.
   */
  async findAll(articleId: string): Promise<CommentDto[]> {
    const comments = await this.prisma.comment.findMany({
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
    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
      include: { replies: true },
    });

    return new CommentDto(comment);
  }
}
