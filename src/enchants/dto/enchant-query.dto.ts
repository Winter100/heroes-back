import { EnchantCategory } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class EnchantQueryDto {
  @IsOptional()
  @IsEnum(EnchantCategory)
  category?: EnchantCategory;
}
