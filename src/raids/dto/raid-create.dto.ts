import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RaidCreateDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  raidId!: number;

  @IsString()
  @IsNotEmpty()
  battle!: string;

  @IsString()
  @IsNotEmpty()
  boss!: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  level!: number;
}
