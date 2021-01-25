import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getRepository, In } from "typeorm";

import { ArticleEntity } from "./article.entity";
import { CommentEntity } from "./comment.entity";
import {
  CreateArticleDto,
  FilterArticle,
  CreateCommentDto,
  ArticleId,
} from "./dto";
import { ArticlesRO, CommentsRO } from "./article.interface";
import { Const } from "../shares/common/const";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}
  //service get list all articles
  async findAll(params: FilterArticle): Promise<ArticlesRO> {
    const { limit, offset } = params;
    const query = await getRepository(ArticleEntity)
      .createQueryBuilder("article")
      .orderBy("article.created", "DESC");

    const total = await query.getCount();

    query.limit(limit || Const.LIMIT);
    query.offset(offset || Const.OFFSET);

    const articles = await query.getMany();
    return { articles, total };
  }
  //service get an articles content
  async findOne(where) {
    const article = await this.articleRepository.findOne(where);
    // check article exists
    if (!article) {
      throw new NotFoundException("Article not exists.");
    } else {
      return { article };
    }
  }
  //service create article
  async create(articleData: CreateArticleDto): Promise<ArticleEntity> {
    let article = new ArticleEntity();
    article.title = articleData.title;
    article.content = articleData.content;
    article.nickname = articleData.nickname;

    const newArticle = await this.articleRepository.save(article);
    return newArticle;
  }
  //service create comment and comment on a comment
  async createComment(commentData: CreateCommentDto): Promise<CommentEntity> {
    let article = await this.articleRepository.findOne({
      id: commentData.article_id,
    });
    // check article exists
    if (!article) {
      throw new NotFoundException("Article not exists.");
    }
    // check comment is level 1 and exists
    if (commentData.parent_id) {
      let parent = await this.commentRepository.findOne({
        id: commentData.parent_id,
        parent_id: null,
      });
      if (!parent) throw new NotFoundException("Comment not exists.");
    }

    let comment = new CommentEntity();
    comment.article_id = commentData.article_id;
    comment.content = commentData.content;
    comment.parent_id = commentData.parent_id || null;
    comment.nickname = commentData.nickname;
    const newComment = await this.commentRepository.save(comment);
    return newComment;
  }
  //service get comment on an article
  async getComments(id: ArticleId): Promise<CommentsRO> {
    let article = await this.articleRepository.findOne(id);
    // check article exists
    if (!article) {
      throw new NotFoundException("Article not exists.");
    }
    //get comment level 1
    const commentLevel1 = await this.commentRepository.find({
      where: {
        article_id: id.id,
        parent_id: null,
      },
      order: { created: "DESC" },
    });
    //get comment level 2
    if (commentLevel1.length > 0) {
      let listId = commentLevel1.map((e) => e.id);
      const commentLevel2 = await this.commentRepository.find({
        where: {
          parent_id: In(listId),
        },
        order: { parent_id: "DESC", created: "DESC" },
      });
      //assign comment level 2 to comment level 1
      commentLevel1.forEach((e) => {
        e["child"] = commentLevel2.filter((elm) => elm["parent_id"] === e.id);
      });
    }

    return { comments: commentLevel1 };
  }
}
