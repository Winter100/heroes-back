import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class SlotId {
  @IsInt({ each: true })
  @Type(() => Number)
  slotId!: number;
}

export class Effect {
  @IsInt()
  @Min(1)
  statId!: number;

  @IsString()
  @IsOptional()
  value?: string;
}

export class UpsertEnchantDetailDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Effect)
  effects!: Effect[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotId)
  slotsId!: SlotId[];

  // @IsOptional()
  // @IsArray()
  // @IsInt({ each: true })
  // @Type(() => Number)
  // getRaidsId?: number[];

  // @IsOptional()
  // @IsArray()
  // @IsInt({ each: true })
  // @Type(() => Number)
  // getItemsId?: number[];
}
