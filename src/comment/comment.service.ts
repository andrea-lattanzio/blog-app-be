import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';
import { DatabaseService } from 'src/config/database/database.service';
import { CommentDto } from './dto/body';
import { NO_SUBREPLY } from './constants/comment.constants';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    if (createCommentDto.parentId) this.stopSubReply(createCommentDto.parentId);
    const createdComment = await this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        author: { connect: { id: userId } },
        article: { connect: { id: createCommentDto.articleID } },
        ...(createCommentDto.parentId && {
          parent: { connect: { id: createCommentDto.parentId } },
        }),
      },
    });

    return new CommentDto(createdComment);
  }

  private async stopSubReply(parentId?: string) {
    const parent = await this.prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (parent.parentId) throw new BadRequestException(NO_SUBREPLY);
  }

  async findAll(): Promise<CommentDto[]> {
    const comments = await this.prisma.comment.findMany();
    return CommentDto.fromEntities(comments);
  }

  async findOne(id: string): Promise<CommentDto> {
    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: { id },
      include: { replies: true },
    });
    return new CommentDto(comment);
  }
}
