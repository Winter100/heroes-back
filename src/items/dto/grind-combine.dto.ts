import { Type } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';

export class GrindCombineDto {
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids!: number[];
}
