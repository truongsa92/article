import { Get, Post, Body, Query, Param, Controller } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiProperty, ApiParam } from "@nestjs/swagger";

import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto, FilterArticle } from './dto';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { ArticlesRO, ArticleRO, CommentsRO } from './article.interface'

@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) { }

  @Get()
  async findAll(@Query() query: FilterArticle): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @Get(':id')
  @ApiParam({name: 'id', type: Number, required: true })
  async findOne(@Param('id') id): Promise<ArticleRO> {
    return await this.articleService.findOne({ id });
  }

  @Get(':articleId/comments')
  @ApiParam({name: 'articleId', type: Number, required: true })
  async getComments(@Param('articleId') articleId): Promise<CommentsRO> {
    return await this.articleService.getComments(articleId);
  }

  @Post()
  @ApiOperation({operationId: 'createArticle'})
  @ApiBody({type: CreateArticleDto, required: true})
  async create(@Body() articleData: CreateArticleDto): Promise<ArticleEntity> {
    return this.articleService.create(articleData);
  }

  @Post('comments')
  @ApiOperation({operationId: 'createComment'})
  async createComment(@Body() commentData: CreateCommentDto): Promise<CommentEntity> {
    return await this.articleService.createComment(commentData);
  }

}
