import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { typeOrmConfig } from '../../../ormconfig';
import { ArticleController } from '../article.controller';
import { ArticleService } from '../article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../article.entity';
import { CommentEntity } from '../comment.entity'


describe('Unit Test', () => {
  let articleController: ArticleController;
  let articleService: ArticleService;
  let app

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ... typeOrmConfig,
          maxQueryExecutionTime: 1000,
          keepConnectionAlive: true
        }),
        TypeOrmModule.forFeature([ArticleEntity, CommentEntity])
      ],
      controllers: [ArticleController],
      providers: [ArticleService],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    articleService = module.get<ArticleService>(ArticleService);
    articleController = module.get<ArticleController>(ArticleController);
  });

  describe('Article Service', () => {
    describe('Create article', () => {
      it('When title is not required. Cant be save.', async () => {
        const response = await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: '',
            content: 'content',
            nickname: 'nickname',
          })
        const responseData = response.body;
        expect(responseData.statusCode).toEqual(400);
      });

      it('When content is not required. Cant be save.', async () => {
        const response = await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: 'title',
            content: '',
            nickname: 'nickname',
          })
        const responseData = response.body;
        expect(responseData.statusCode).toEqual(400);
      });

      it('When nickname is not required. Cant be save.', async () => {
        const response = await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: 'title',
            content: 'content',
            nickname: '',
          })
        const responseData = response.body;
        expect(responseData.statusCode).toEqual(400);
      });

      it('When nickname is greater then 100 character. Cant be save.', async () => {
        const response = await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: 'title',
            content: 'content',
            nickname: 'titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitle',
          })
        const responseData = response.body;
        expect(responseData.statusCode).toEqual(400);
      });

      it('When title is greater then 512 character. Cant be save.', async () => {
        const response = await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: 'titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitle',
            content: 'content',
            nickname: 'nickname',
          })
        const responseData = response.body;
        expect(responseData.statusCode).toEqual(400);
      });

      it('When body is valid. Can be save.', async () => {
        await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: 'title_' + Math.floor(Math.random() * 1000),
            content: 'content_' + Math.floor(Math.random() * 1000),
            nickname: 'nickname_' + Math.floor(Math.random() * 1000),
          }).expect(201)
      });
    })
  });

  describe('Comment Service', () => {
    describe('Create comment in article', () => {
      it('When content is greater then 500 character. Cant be save.', async () => {
        const response = await request(app.getHttpServer())
          .post('/articles')
          .send({
            articles_id: 1,
            parent_id: 1,
            content: 'titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitle',
            nickname: 'nickname_' + + Math.floor(Math.random() * 1000),
          })
        const responseData = response.body;
        expect(responseData.statusCode).toEqual(400);
      });

      it('When article_id is not exists. Cant be save.', async () => {
        await request(app.getHttpServer())
        .post('/articles/comments')
        .send({
          article_id: 99999999999999,
          parent_id: null,
          content: 'content',
          nickname: 'nickname',
        }).expect(404)
      })

      it('When article_id exists and valid body. Can be save.', async () => {
        const responseArticle = await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: 'title_' + Math.floor(Math.random() * 1000),
            content: 'content_' + Math.floor(Math.random() * 1000),
            nickname: 'nickname_' + Math.floor(Math.random() * 1000),
          })
        const idArticle = responseArticle.body.id

        await request(app.getHttpServer())
        .post('/articles/comments')
        .send({
          article_id: idArticle,
          parent_id: null,
          content: 'content_' + Math.floor(Math.random() * 1000),
          nickname: 'nickname_' + + Math.floor(Math.random() * 1000),
        }).expect(201)
      })
    })

    describe('Create comment in comment', () => {
      // Can comment 2 level only
      it('When comments is not exists. Cant be save.', async () => {
        const responseArticle = await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: 'title_' + Math.floor(Math.random() * 1000),
            content: 'content_' + Math.floor(Math.random() * 1000),
            nickname: 'nickname_' + Math.floor(Math.random() * 1000),
          })
        const idArticle = responseArticle.body.id

        await request(app.getHttpServer())
        .post('/articles/comments')
        .send({
          article_id: idArticle,
          parent_id: 9999999999,
          content: 'content_' + Math.floor(Math.random() * 1000),
          nickname: 'nickname_' + + Math.floor(Math.random() * 1000),
        }).expect(404)
      })

      it('When comments is exists. Cant be save.', async () => {
        const responseArticle = await request(app.getHttpServer())
          .post('/articles')
          .send({
            title: 'title_' + Math.floor(Math.random() * 1000),
            content: 'content_' + Math.floor(Math.random() * 1000),
            nickname: 'nickname_' + Math.floor(Math.random() * 1000),
          })
        const idArticle = responseArticle.body.id

        const responseComment = await request(app.getHttpServer())
        .post('/articles/comments')
        .send({
          article_id: idArticle,
          parent_id: null,
          content: 'content_' + Math.floor(Math.random() * 1000),
          nickname: 'nickname_' + + Math.floor(Math.random() * 1000),
        })
        const idComment = responseComment.body.id

        await request(app.getHttpServer())
        .post('/articles/comments')
        .send({
          article_id: idArticle,
          parent_id: idComment,
          content: 'content_' + Math.floor(Math.random() * 1000),
          nickname: 'nickname_' + + Math.floor(Math.random() * 1000),
        }).expect(201)
      })
    })
  })
});
