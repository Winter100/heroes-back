import { Expose } from 'class-transformer';

export class CharacterClassResponseDto {
  id: number;

  @Expose()
  name: string;

  @Expose()
  image: string;
}
