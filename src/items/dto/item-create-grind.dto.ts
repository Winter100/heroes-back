import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

export class Ingredients {
  @IsInt()
  @IsNotEmpty()
  statId!: number;

  @IsInt()
  @IsNotEmpty()
  statOneValue!: number;

  @IsInt()
  @IsNotEmpty()
  statMaxValue!: number;

  @IsInt()
  @IsNotEmpty()
  itemId!: number;

  @IsInt()
  @IsNotEmpty()
  quantity!: number;
}

export class UpsertGrindDto {
  @IsInt()
  @IsNotEmpty()
  titleId!: number;

  @IsInt()
  @IsNotEmpty()
  slotId!: number;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Ingredients)
  data!: Ingredients[];
}
