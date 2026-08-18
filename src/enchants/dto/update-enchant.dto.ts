import { PartialType } from '@nestjs/mapped-types';
import { CreateEnchantDto } from './create-enchant.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEnchantDto extends PartialType(CreateEnchantDto) {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id!: number;
}
