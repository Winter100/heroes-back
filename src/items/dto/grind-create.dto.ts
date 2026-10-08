import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

export class GrindEffect {
  @IsInt()
  @IsNotEmpty()
  itemId!: number;

  @IsInt()
  @IsNotEmpty()
  quantity!: number;

  @IsInt()
  @IsNotEmpty()
  statId!: number;

  @IsInt()
  @IsNotEmpty()
  statOneValue!: number;

  @IsInt()
  @IsNotEmpty()
  statMaxValue!: number;
}

export class CreateGrindDto {
  @IsInt()
  @IsNotEmpty()
  titleId!: number;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GrindEffect)
  effects!: GrindEffect[];
}
