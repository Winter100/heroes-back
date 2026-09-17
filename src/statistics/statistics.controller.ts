import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  // 캐릭터 통계
  @Get('character')
  statisticsCharacter() {
    return this.statisticsService.getCharacterStats();
  }

  // 인챈트 통계
  @Get('enchant')
  statisticsEnchant() {
    return this.statisticsService.getEnchantStats();
  }

  // 레이드 통계
  @Get('raid')
  statisticsRaid() {
    return this.statisticsService.getRaidStats();
  }

  // 아이템 통계
  @Get('item')
  statisticsItem() {
    return this.statisticsService.getItemStats();
  }
}
