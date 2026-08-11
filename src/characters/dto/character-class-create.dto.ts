import { BattleType, Gender } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsEnum(BattleType, {
    message: `전투형태는 ${Object.values(BattleType).join(', ')}중 하나여야 합니다.`,
  })
  @IsOptional()
  battleType?: BattleType;

  @IsString()
  @IsEnum(Gender, {
    message: `성별은 ${Object.values(Gender).join(', ')}중 하나여야 합니다.`,
  })
  gender!: Gender;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  releaseDate!: Date;
}
