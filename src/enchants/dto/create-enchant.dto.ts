import { EnchantCategory } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEnchantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  @IsEnum(EnchantCategory)
  category: EnchantCategory = EnchantCategory.ENCHANT;

  @IsInt()
  @IsNotEmpty()
  rankId!: number;

  @IsInt()
  @IsNotEmpty()
  tierId!: number;

  @IsInt()
  @IsNotEmpty()
  affixId!: number;
}
