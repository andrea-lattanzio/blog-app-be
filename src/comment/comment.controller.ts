import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Comment',
    description: 'This endpoint creates a new comment entity',
  })
  create(
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create(userId, createCommentDto);
  }

  @Public()
  @Get('/article/:id')
  @ApiOperation({
    summary: 'Get Comments',
    description:
      'This endpoint returns a list of all comments without their replies',
  })
  findAll(@Param('id') articleId: string) {
    return this.commentService.findAll(articleId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get one comment',
    description: 'This endpoint returns a single comment with its replies',
  })
  findOne(@Param('id') commentId: string) {
    return this.commentService.findOne(commentId);
  }
}
