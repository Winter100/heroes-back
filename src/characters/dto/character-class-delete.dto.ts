import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteClassDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  classId!: number;

  @IsString()
  @IsNotEmpty()
  className!: string;
}
