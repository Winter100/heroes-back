import { IsString } from 'class-validator';

export class RaidTitleCreateDto {
  @IsString()
  title!: string;
}
