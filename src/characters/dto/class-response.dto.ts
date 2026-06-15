import { ClassSkillResponseDto } from './class-skill-response.dto';
import { Expose, Type } from 'class-transformer';

export class ClassResponseDto {
  name: string;
  image: string;

  @Expose()
  @Type(() => ClassSkillResponseDto)
  skills: ClassSkillResponseDto[];
}
