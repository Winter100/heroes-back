import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  categoryId!: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  tierId!: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  slotId?: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpsertRecipeDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Material)
  recipes!: Material[];
}

export class Material {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  stepId!: number;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  quantity!: number;
}

export class Effects {
  @IsInt()
  @Min(1)
  stat_id!: number;

  @IsInt()
  stat_value!: number;
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

export class UpsertStepDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  stepId?: number;

  @ValidateNested()
  @Type(() => StepsDto)
  steps!: StepsDto;
}
