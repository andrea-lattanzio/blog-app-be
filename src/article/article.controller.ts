import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleDto } from './dto/body';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { ArticleQueryDto } from './dto/article.query.dto';
import { paginateResponse } from 'src/shared/presenter/paginateResponse';
import { OptionalAuth } from 'src/shared/decorators/optionalAuth.decorator';
import { Role } from 'src/shared/decorators/user.role.decorator';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/shared/guards/role.guard';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Post()
  @Role(UserRole.Author)
  @UseGuards(RoleGuard)
  @ApiOperation({
    summary: 'Create Article',
    description:
      'This endpoint creates a new article entity as well as related chapters, paragraphs and code sections',
  })
  create(
    @GetUser('id') userId: string,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    return this.articleService.create(userId, createArticleDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get Articles',
    description:
      'This endpoint returns a list of all articles without related entities',
  })
  async findAll(@Query() findArticleDto: ArticleQueryDto) {
    const { page } = findArticleDto;

    let total: number = 0;
    let items: ArticleDto[] = [];
    try {
      [total, items] = await Promise.all([
        this.articleService.count(findArticleDto),
        this.articleService.findAll(findArticleDto),
      ]);
    } catch (error) {
      console.error(error);
      return paginateResponse<ArticleDto>(page, [], total, true);
    }

    return paginateResponse<ArticleDto>(page, items, total);
  }

  @Public()
  @Get('/latest-three')
  @ApiOperation({
    summary: 'Get Article',
    description:
      'This endpoint returns a single article along with all the related entities',
  })
  async getLatestThree(): Promise<ArticleDto[]> {
    return this.articleService.getLatestThree();
  }


  @OptionalAuth()
  @Get(':id')
  @ApiOperation({
    summary: 'Get Article',
    description:
      'This endpoint returns a single article along with all the related entities',
  })
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.articleService.findOne(id, userId);
  }

  
  @Patch(':id')
  @ApiOperation({
    summary: 'Update Article',
    description: 'This endpoint updates an article',
  })
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Post('/like/:id')
  @ApiOperation({
    summary: 'Like Article',
    description: 'This endpoint adds a like to an article',
  })
  addLike(
    @GetUser('id') userId: string,
    @Param('id') articleId: string
  ) {
    return this.articleService.addLike(userId, articleId);
  }

  @Delete('/like/:id')
  @ApiOperation({
    summary: 'Remove Article Like',
    description: 'This endpoint removes a like to an article',
  })
  removeLike(
    @GetUser('id') userId: string,
    @Param('id') articleId: string
  ) {
    return this.articleService.removeLike(userId, articleId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Article',
    description: 'This endpoint removes an article',
  })
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
