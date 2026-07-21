import { IsNotEmpty, IsString } from 'class-validator';

export class CharacterClassCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
