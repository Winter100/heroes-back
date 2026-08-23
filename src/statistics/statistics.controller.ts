import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('character')
  statisticsCharacter() {
    return this.statisticsService.character();
  }

  @Get('enchant')
  statisticsEnchant() {
    return this.statisticsService.enchant();
  }

  @Get('raid')
  statisticsRaid() {
    return this.statisticsService.raid();
  }

  @Get('item')
  statisticsItem() {
    return this.statisticsService.item();
  }
}
