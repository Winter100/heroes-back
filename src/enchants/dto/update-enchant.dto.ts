import { PartialType } from '@nestjs/mapped-types';
import { CreateEnchantDto } from './create-enchant.dto';

export class UpdateEnchantDto extends PartialType(CreateEnchantDto) {}
