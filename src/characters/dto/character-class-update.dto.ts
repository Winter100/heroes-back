import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './character-class-create.dto';

export class UpdateClassDto extends PartialType(CreateClassDto) {}
