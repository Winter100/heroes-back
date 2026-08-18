import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Effects } from 'src/items/dto/item-create.dto';

export class UpsertEnchantDetailDto {
  @IsInt()
  @IsNotEmpty()
  id!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Effects)
  effects!: Effects[];

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  slotsId!: number[];

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
