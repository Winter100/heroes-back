import { Controller, Get, UseGuards } from '@nestjs/common';
import { PartholnService } from './partholn.service';
import { PartholnType } from './constant/partholn';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('partholn')
export class PartholnController {
  constructor(private readonly partholnService: PartholnService) {}

  @Get()
  async findAll(): Promise<PartholnType[]> {
    return await this.partholnService.findAll();
  }
}
