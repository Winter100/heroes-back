import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Stats {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  statId!: number;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  value!: number;
}

class BossStats {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Stats)
  effects!: Stats[];
}

class BossBonus {
  @IsString()
  @IsNotEmpty()
  bonus!: string;

  @IsString()
  @IsNotEmpty()
  value!: string;
}

export class RaidDetailUpsertDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BossStats)
  bossStats?: BossStats[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BossBonus)
  bonus?: BossBonus[];
}
