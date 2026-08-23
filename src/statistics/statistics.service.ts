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
  character() {
    return this.charactersService.findStatistics();
  }
  enchant() {
    return this.enchantService.findStatistics();
  }
  raid() {
    return this.raidService.findStatistics();
  }
  item() {
    return this.itemService.findStatistics();
  }
}
