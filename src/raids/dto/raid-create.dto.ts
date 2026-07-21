import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RaidCreateDto {
  @IsString()
  raidName!: string;

  @IsString()
  battle!: string;

  @IsString()
  boss!: string;

  @Type(() => Number)
  @IsNumber()
  level!: number;
}
