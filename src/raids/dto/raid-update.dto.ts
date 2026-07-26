import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RaidCreateDto } from './raid-create.dto';

export class UpdateRaidDto extends PartialType(RaidCreateDto) {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  image?: string;
}
