import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './item-create.dto';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Trim } from 'src/common/decorators/trim.decorator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepsDto)
  steps?: StepsDto[];

  @IsOptional()
  @IsInt()
  slotId?: number;
}

export class StepsDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  stepName!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Effects)
  effects?: Effects[];
}

export class Effects {
  @IsInt()
  @Min(1)
  stat_id!: number;

  @IsInt()
  stat_value!: number;
}
