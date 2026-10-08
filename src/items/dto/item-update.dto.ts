import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './item-create.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {}
