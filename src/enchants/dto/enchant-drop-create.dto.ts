import { IsOptional, IsString } from 'class-validator';

export class EnchantDropCreateDto {
  @IsString()
  enchantName: string;

  @IsString()
  @IsOptional()
  battleName?: string;

  @IsString()
  @IsOptional()
  itemName?: string;
}
