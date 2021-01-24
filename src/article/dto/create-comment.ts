import { IsNotEmpty, MaxLength, Min, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  parent_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  article_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  nickname: string;
}
