import { Controller, Get, Query } from '@nestjs/common';

import { SearchItemDto } from '../dto/search-item.dto';
import { ItemService } from '../service/items.service';
import { IntParam } from 'src/common/decorators/int.param';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // 모든 아이템 간단 조회
  @Get('all')
  findAllItems() {
    return this.itemService.findAllItems();
  }

  // 모든 아이템 상세 조회
  @Get('step')
  findAllSteps() {
    return this.itemService.findAllSteps();
  }

  // 특정 아이템 검색
  @Get()
  findItemByName(@Query('name') name: string) {
    return this.itemService.findItemByName(name);
  }

  // 특정 아이템 검색
  @Get('search')
  itemInfo(@Query() searchItemDto: SearchItemDto) {
    return this.itemService.findItemsByCategory(searchItemDto);
  }

  // 모든 아이템 연마 조회
  @Get('grind')
  findGrindInfo() {
    return this.itemService.findGrindInfo();
  }

  // 모든 아이템 세트 옵션 조회
  @Get('set-option')
  findItemSetOption() {
    return this.itemService.findItemSetOption();
  }

  @Get('recipe')
  getItemRecipe() {
    return this.itemService.getItemRecipe();
  }

  @Get('step/:itemId')
  findStepByItemId(
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
  ) {
    return this.itemService.findStepByItemId(itemId);
  }
}
