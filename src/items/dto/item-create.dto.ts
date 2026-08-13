import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

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

  @IsString()
  description!: string;
}
