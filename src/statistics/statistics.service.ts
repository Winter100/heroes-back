import { ItemService } from './../items/service/items.service';
import { RaidService } from './../raids/service/raids.service';
import { EnchantService } from './../enchants/service/enchants.service';
import { CharactersService } from './../characters/service/characters.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly charactersService: CharactersService,
    private readonly enchantService: EnchantService,
    private readonly raidService: RaidService,
    private readonly itemService: ItemService,
  ) {}
  async getCharacterStats() {
    return await this.charactersService.findStatistics();
  }

  async getEnchantStats() {
    return await this.enchantService.findStatistics();
  }

  async getRaidStats() {
    return await this.raidService.findStatistics();
  }

  async getItemStats() {
    return await this.itemService.findStatistics();
  }
}
