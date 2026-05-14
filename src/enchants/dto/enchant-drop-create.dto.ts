import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EnchantDropCreateDto {
  @IsString()
  @IsNotEmpty()
  enchantName!: string;

  @IsString()
  @IsOptional()
  battleName?: string;

  @IsString()
  @IsOptional()
  itemName?: string;
}
