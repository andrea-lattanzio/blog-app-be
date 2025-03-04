import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleDto } from './dto/body';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Article',
    description:
      'This endpoint creates a new article entity as well as related chapters, paragraphs and code sections',
  })
  @ApiBody({
    description: 'Article information',
    type: CreateArticleDto,
  })
  @ApiCreatedResponse({
    description: 'The article was succesfully created',
    type: ArticleDto,
  })
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get Articles',
    description:
      'This endpoint returns a list of all articles without related entities',
  })
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Article',
    description:
      'This endpoint returns a single article along with all the related entities',
  })
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
  //   return this.articleService.update(id, updateArticleDto);
  // }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Article',
    description: 'This endpoint removes an article',
  })
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
