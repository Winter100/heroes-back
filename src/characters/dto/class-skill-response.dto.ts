import { Expose } from 'class-transformer';

export class ClassSkillResponseDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  image: string;
}
