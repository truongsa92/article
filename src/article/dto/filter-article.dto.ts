import { IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterArticle {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
