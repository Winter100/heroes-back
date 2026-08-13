import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { ThrottlerGuard } from '@nestjs/throttler';
import { SearchItemDto } from '../dto/search-item.dto';
import { ItemService } from '../service/items.service';

@UseGuards(ThrottlerGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async findItemByName(@Query('name') name: string) {
    return await this.itemService.findItemByName(name);
  }

  @Get('search')
  async itemInfo(@Query() searchItemDto: SearchItemDto) {
    return await this.itemService.findItemsByCategory(searchItemDto);
  }

  @Get('grind')
  async findGrindInfo() {
    return await this.itemService.findGrindInfo();
  }

  @Get('set-option')
  async findItemSetOption() {
    return await this.itemService.findItemSetOption();
  }

  @Get('recipe')
  async getItemRecipe() {
    return await this.itemService.getItemRecipe();
  }
}
