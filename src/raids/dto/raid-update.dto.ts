import { PartialType } from '@nestjs/mapped-types';
import { RaidCreateDto } from './raid-create.dto';

export class UpdateRaidDto extends PartialType(RaidCreateDto) {}
