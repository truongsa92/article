import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { ArticleModule } from './article/article.module';
import { typeOrmConfig  } from '../ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticleModule,
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {}
