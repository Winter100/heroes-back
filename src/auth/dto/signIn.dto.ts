import { OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { SignUpDto } from './signUp.dto';

export class SignInDto extends OmitType(SignUpDto, ['name']) {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
