import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './item-create.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  image?: string;
}
