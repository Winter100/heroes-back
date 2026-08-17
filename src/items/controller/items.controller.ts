import { Controller, Get, Query, UseGuards } from '@nestjs/common';

// import { ThrottlerGuard } from '@nestjs/throttler';
import { SearchItemDto } from '../dto/search-item.dto';
import { ItemService } from '../service/items.service';
import { IntParam } from 'src/common/decorators/int.param';

// @UseGuards(ThrottlerGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('all')
  findAllItems() {
    return this.itemService.findAllItems();
  }

  @Get('step')
  findAllSteps() {
    return this.itemService.findAllSteps();
  }

  @Get()
  findItemByName(@Query('name') name: string) {
    return this.itemService.findItemByName(name);
  }

  @Get('search')
  itemInfo(@Query() searchItemDto: SearchItemDto) {
    return this.itemService.findItemsByCategory(searchItemDto);
  }

  @Get('grind')
  findGrindInfo() {
    return this.itemService.findGrindInfo();
  }

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
