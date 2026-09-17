import { Transform, TransformFnParams } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillDto {
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

  @IsString({ message: '스킬 이름은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '스킬 이름을 입력해주세요' })
  name!: string;

  @IsString({ message: '스킬 설명은 문자열이어야 합니다' })
  @IsNotEmpty({ message: '스킬 설명이 입력해주세요' })
  description!: string;
}
