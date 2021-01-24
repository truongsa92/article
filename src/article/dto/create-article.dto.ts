import { IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(512)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  nickname: string;
}
