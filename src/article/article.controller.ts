import {
  Get,
  Post,
  Body,
  Query,
  Param,
  Controller,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiProperty, ApiParam } from "@nestjs/swagger";

import { ArticleService } from "./article.service";
import {
  CreateArticleDto,
  CreateCommentDto,
  FilterArticle,
  ArticleId,
} from "./dto";
import { ArticleEntity } from "./article.entity";
import { CommentEntity } from "./comment.entity";
import { ArticlesRO, ArticleRO, CommentsRO } from "./article.interface";

@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  //get list all articles
  @Get()
  async findAll(@Query() query: FilterArticle): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }
  //Api get an articles content
  @Get(":id")
  @ApiParam({ name: "id", type: ArticleId, required: true })
  async findOne(@Param() id: ArticleId): Promise<ArticleRO> {
    return await this.articleService.findOne(id);
  }
  //Api get comment on an article
  @Get(":id/comments")
  @ApiParam({ name: "id", type: ArticleId, required: true })
  async getComments(@Param() id: ArticleId): Promise<CommentsRO> {
    return await this.articleService.getComments(id);
  }
  //Api create article
  @Post()
  @ApiOperation({ operationId: "createArticle" })
  @ApiBody({ type: CreateArticleDto, required: true })
  async create(@Body() articleData: CreateArticleDto): Promise<ArticleEntity> {
    return this.articleService.create(articleData);
  }
  //Api create comment and comment on a comment
  @Post("comments")
  @ApiOperation({ operationId: "createComment" })
  async createComment(
    @Body() commentData: CreateCommentDto
  ): Promise<CommentEntity> {
    return await this.articleService.createComment(commentData);
  }
}
