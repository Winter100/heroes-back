import { PartialType } from '@nestjs/mapped-types';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';
import { CreateSkillDto } from './create-skill.dto';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
  @Transform(({ value }: TransformFnParams) => {
    const raw: unknown = value;
    let parsed: unknown;
    try {
      parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      parsed = [];
    }
    if (!Array.isArray(parsed)) return [];
    return parsed.map((v) => Number(v as unknown));
  })
  @IsArray({ message: '클래스 ID는 배열이어야 합니다' })
  @IsInt({ each: true, message: '클래스 ID는 숫자여야 합니다' })
  classIds!: number[];
}
