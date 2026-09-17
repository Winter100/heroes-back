import { Controller, Get } from '@nestjs/common';
import { PartholnService } from './partholn.service';
import { PartholnType } from './constant/partholn';

@Controller('partholn')
export class PartholnController {
  constructor(private readonly partholnService: PartholnService) {}

  @Get()
  async findAll(): Promise<PartholnType[]> {
    return await this.partholnService.findAll();
  }
}
