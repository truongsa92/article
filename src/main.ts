import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {writeFileSync} from "fs";

import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(ApplicationModule, appOptions);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Demo')
    .setDescription('The demo API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync("./swagger.json", JSON.stringify(document));
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
