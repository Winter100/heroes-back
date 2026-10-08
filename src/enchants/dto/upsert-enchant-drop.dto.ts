import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class UpsertEnchantDropDto {
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  battleIds!: number[];
}
