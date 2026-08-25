import { ItemService } from './../items/service/items.service';
import { RaidService } from './../raids/service/raids.service';
import { EnchantService } from './../enchants/service/enchants.service';
import { CharactersService } from './../characters/service/characters.service';
import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectPinoLogger(StatisticsService.name)
    private readonly logger: PinoLogger,
    private readonly charactersService: CharactersService,
    private readonly enchantService: EnchantService,
    private readonly raidService: RaidService,
    private readonly itemService: ItemService,
  ) {}
  async getCharacterStats() {
    this.logger.debug('캐릭터 통계 데이터를 조회합니다.');
    return await this.charactersService.findStatistics();
  }

  async getEnchantStats() {
    this.logger.debug('인챈트 통계 데이터를 조회합니다.');
    return await this.enchantService.findStatistics();
  }

  async getRaidStats() {
    this.logger.debug('레이드 통계 데이터를 조회합니다.');
    return await this.raidService.findStatistics();
  }

  async getItemStats() {
    this.logger.debug('아이템 통계 데이터를 조회합니다.');
    return await this.itemService.findStatistics();
  }
}
