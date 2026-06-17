import { IsOptional, IsString } from 'class-validator';

export class SearchItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  tier?: string;
}
