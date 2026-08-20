import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

// class Stats {
//   @Type(() => Number)
//   @IsInt()
//   @IsNotEmpty()
//   statId!: number;

//   @Type(() => Number)
//   @IsInt()
//   @IsNotEmpty()
//   value!: number;
// }

class BossStats {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  id!: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  stat_value!: number;
}

// class BossBonus {
//   @IsString()
//   @IsNotEmpty()
//   bonus!: string;

//   @IsString()
//   @IsNotEmpty()
//   value!: string;
// }

export class RaidDetailUpsertDto {
  @IsEnum(['ENTRY', 'LIMIT'])
  @IsNotEmpty()
  mode!: 'ENTRY' | 'LIMIT';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BossStats)
  effects!: BossStats[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => BossBonus)
  // bonus?: BossBonus[];
}
