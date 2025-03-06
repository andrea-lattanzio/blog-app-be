import { Injectable } from '@nestjs/common';
import { CreateCommentDto, CreateReplyDto } from './dto/create-comment.dto';
import { DatabaseService } from 'src/config/database/database.service';
import { CommentModule } from './comment.module';
import { CommentDto } from './dto/body';
import { CreateReadStreamOptions } from 'fs/promises';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    const createdComment = await this.prisma.comment.create({
      data: { ...createCommentDto, userId },
    });

    return new CommentDto(createdComment);
  }

  async createReply(userId: string, createReplyDto: CreateReplyDto) {
    const createdReply = await this.prisma.comment.create({
      data: { ...createReplyDto, userId },
    });

    return new CommentDto(createdReply);
  }

  async findAll(): Promise<CommentDto[]> {
    const comments = await this.prisma.comment.findMany();
    return CommentDto.fromEntities(comments);
  }

  async findOne(id: string): Promise<CommentDto> {
    const comment = await this.prisma.comment.findUniqueOrThrow({
      where: { id },
      include: { replies: true }
    });
    return new CommentDto(comment);
  }

  remove(id: string) {
    return `This action removes a #${id} comment`;
  }
}
