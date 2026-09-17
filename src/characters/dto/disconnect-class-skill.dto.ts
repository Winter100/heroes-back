import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DisconnectClassSkill {
  @Type(() => Number)
  @IsNotEmpty({ message: '직업 ID를 입력해주세요' })
  classId!: number;
}
