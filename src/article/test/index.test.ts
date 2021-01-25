import { ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";

import { typeOrmConfig } from "../../../ormconfig";
import { ArticleController } from "../article.controller";
import { ArticleService } from "../article.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "../article.entity";
import { CommentEntity } from "../comment.entity";

describe("Unit Test", () => {
  let articleController: ArticleController;
  let articleService: ArticleService;
  let app;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...typeOrmConfig,
          maxQueryExecutionTime: 1000,
          keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature([ArticleEntity, CommentEntity]),
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
  //length 50 characters
  let text50 = "asasasasasasasasasasasasasasasasasasasasasasasasas";
  //length 100 characters
  let text100 =
    "asasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasas";
  //length 500 characters
  let text500 = "";
  for (let i = 0; i < 5; i++) {
    text500 +=
      "asasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasas";
  }
  //length 5000 characters
  let text5000 = "";
  for (let i = 0; i < 50; i++) {
    text5000 +=
      "asasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasas";
  }
  /*
  Api get list all articles
  */
  describe("Get list all articles", () => {
    it("Get list all articles", async () => {
      const data = await request(app.getHttpServer()).get(
        "/articles?limit=20&offset=0"
      );
      expect(data.statusCode).toEqual(200);
    });
  });
  /*
  Api get an articles content
  */
  describe("Get an articles content", () => {
    // Params ArticlesID < 0, cant be get;
    it("Params ArticlesID <0 ,cant be get", async () => {
      const response = await request(app.getHttpServer()).get("/articles/-1");
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    // Params ArticlesID =0, cant be get
    it("Params: ArticlesID =0", async () => {
      const response = await request(app.getHttpServer()).get("/articles/0");
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    // Params ArticlesID not exist ,cant be get
    it("Params: ArticlesID not exist", async () => {
      const response = await request(app.getHttpServer()).get("/articles/1");
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(404);
    });
    // Params ArticlesID valid,can be get
    it("Params: ArticlesID : valid", async () => {
      const response = await request(app.getHttpServer()).get("/articles/22");
      expect(response.statusCode).toEqual(200);
    });
  });
  /*
  Api create article
  */
  describe("Create article", () => {
    //When nickname is not required. Cant be save.
    it("When nickname is not required. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles")
        .send({
          title: "title",
          content: "content",
          nickname: "",
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When title is not required. Cant be save.
    it("When title is not required. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles")
        .send({
          title: "",
          content: "content",
          nickname: "nickname",
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When content is not required. Cant be save.
    it("When content is not required. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles")
        .send({
          title: "title",
          content: "",
          nickname: "nickname",
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When nickname is greater then 100 character. Cant be save.
    it("When nickname is greater then 50 character. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles")
        .send({
          title: "title",
          content: "content",
          nickname: text5000,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When title is greater then 512 character. Cant be save.
    it("When title is greater then 512 character. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles")
        .send({
          title: text5000,
          content: "content",
          nickname: "nickname",
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When content is greater then 5000 character. Cant be save.
    it("When content is greater then 5000 character. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles")
        .send({
          title: "title",
          content: text5000 + "text",
          nickname: "nickname",
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When body is valid. Can be save.
    it("When body is valid. Can be save.", async () => {
      await request(app.getHttpServer())
        .post("/articles")
        .send({
          title: "title",
          content: "content",
          nickname: "nickname",
        })
        .expect(201);
    });
  });
  /*Api comment on an article*/
  describe(" Comment on an article", () => {
    //When ArticlesID is not required. Cant be save.
    it("When ArticlesID is not required. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "Nickname",
          content: "Comment",
          article_id: null,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When nickname is not required. Cant be save.
    it("When nickname is not required. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "",
          content: "Comment",
          article_id: 22,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When content is not required. Cant be save.
    it("When content is not required. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "Nickname",
          content: "",
          article_id: 22,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When Nickname is greater then 50 character. Cant be save.
    it("When Nickname is greater then 50 character. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: text5000,
          content: "Comment",
          article_id: 22,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When Comment is greater then 500 character. Cant be save.
    it("When Comment is greater then 500 character. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "Nickname",
          content: text5000,
          article_id: 22,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When articlesID <0. Cant be save.
    it("When ArticlesID <0. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "Nickname",
          content: "Comment",
          article_id: -1,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When articlesID =0. Cant be save.
    it("When ArticlesID =0. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "Nickname",
          content: "Comment",
          article_id: 0,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //When articlesID not exist. Cant be save.
    it("When ArticlesID: not exist. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "Nickname",
          content: "Comment",
          article_id: 1,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(404);
    });
    //Comment on an article successfully. Can be save.
    it("Comment on an article successfully. Can be save.", async () => {
      await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: text50,
          content: text500,
          article_id: 32,
        })
        .expect(201);
    });
  });

  /*Api list all comments of an article*/
  describe("List all comments of an article", () => {
    //Params articlesID <0. Cant not get
    it("Params: ArticlesID <0", async () => {
      const response = await request(app.getHttpServer()).get(
        "/articles/-1/comments"
      );
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //Params articlesID =0. Cant not get
    it("Params: ArticlesID =0", async () => {
      const response = await request(app.getHttpServer()).get(
        "/articles/0/comments"
      );
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //Params articlesID not exist. Cant not get
    it("Params: ArticlesID not exist", async () => {
      const response = await request(app.getHttpServer()).get(
        "/articles/1/comments"
      );
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(404);
    });
    //Params articlesID exist. Can not get
    it("Params: ArticlesID : exist", async () => {
      const response = await request(app.getHttpServer()).get(
        `/articles/194/comments`
      );
      expect(response.statusCode).toEqual(200);
    });
  });
  /*Api comment on a comment*/
  describe("Comment on a comment", () => {
    //ArticlesID null. Cant be save.
    it("ArticlesID: null. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: text50,
          content: "text500",
          parent_id: 22,
          article_id: null,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //Nickname null. Cant be save.
    it("Nickname: null. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "",
          content: "text500",
          parent_id: 11,
          article_id: 28,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //Comment null. Cant be save.
    it("Comment: Null Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: "",
          parent_id: 11,
          article_id: 28,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //Nickname >50. Cant be save.
    it("Nickname >50 Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: text100,
          content: "content",
          parent_id: 11,
          article_id: 28,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //Comment >500. Cant be save.
    it("Comment >500 Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: text5000,
          parent_id: 11,
          article_id: 28,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //ArticlesID <0. Cant be save.
    it("ArticlesID <0 Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: "content",
          parent_id: 11,
          article_id: -1,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //ArticlesID =0. Cant be save.
    it("ArticlesID =0 Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: "content",
          parent_id: 11,
          article_id: 0,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //ArticlesID not exist. Cant be save.
    it("ArticlesID: not exist. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: "content",
          parent_id: 11,
          article_id: 1,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(404);
    });
    //ParentID <0. Cant be save.
    it("ParentID <0 Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: "content",
          parent_id: -1,
          article_id: 28,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //ParentID =0. Cant be save.
    it("ParentID =0. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: "content",
          parent_id: 0,
          article_id: 28,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(400);
    });
    //ParentID not exist. Cant be save.
    it("ParentID not exist. Cant be save.", async () => {
      const response = await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: "content",
          parent_id: 9999,
          article_id: 28,
        });
      const responseData = response.body;
      expect(responseData.statusCode).toEqual(404);
    });
    //Comment on a comment successfully
    it("Comment on a comment successfully", async () => {
      await request(app.getHttpServer())
        .post("/articles/comments")
        .send({
          nickname: "nickname",
          content: "content",
          parent_id: 28,
          article_id: 29,
        })
        .expect(201);
    });
  });
});
