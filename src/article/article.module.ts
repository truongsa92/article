import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, CommentEntity])],
  providers: [ArticleService],
  controllers: [
    ArticleController
  ]
})
export class ArticleModule {}
