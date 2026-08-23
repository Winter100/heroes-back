import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  ItemRepository,
  ItemWithRelations,
} from '../repository/item.repository';
import { ItemResponseDto } from '../dto/item-response.dto';
import { SearchItemDto } from '../dto/search-item.dto';
import { GrindMapper } from '../mapper/grind-mapper';
import { ItemSetOptionMapper } from '../mapper/item-set-option-mapper';
import { sortRecipe } from '../utils/utils';
import { ItemRecipeMapper } from '../mapper/item-recipe-mapper';
import { ItemMapper } from '../mapper/items-mapper';

@Injectable()
export class ItemService {
  constructor(private readonly itemRepository: ItemRepository) {}

  async findItemById(id: number): Promise<ItemWithRelations> {
    const item = await this.itemRepository.findItemById(id);

    if (!item)
      throw new NotFoundException(`${id}에 해당하는 아이템을 찾지 못했습니다.`);

    return ItemMapper.toItemDetail(item);
  }

  async findStepByStepId(stepId: number) {
    const item = await this.itemRepository.findStepByStepId(stepId);

    if (!item)
      throw new NotFoundException(
        `${stepId}에 해당하는 스탭을 찾지 못했습니다`,
      );

    return plainToInstance(ItemResponseDto, item, {
      excludeExtraneousValues: true,
    });
  }

  async findStepByItemId(itemId: number) {
    const item = await this.itemRepository.findStepByItemId(itemId);

    if (!item)
      throw new NotFoundException(
        `${itemId}에 해당하는 스탭을 찾지 못했습니다`,
      );

    return ItemMapper.toDetailStep(item);
  }

  async findAllItems() {
    const items = await this.itemRepository.findAllItems();
    if (!items) throw new NotFoundException('아이템이 없습니다.');
    return items;
  }

  async findAllSteps() {
    const items = await this.itemRepository.findAllSteps();
    if (!items) throw new NotFoundException('아이템이 없습니다.');
    return items;
  }

  async findItemByName(itemName: string) {
    const item = await this.itemRepository.findItemByName(itemName);

    if (!item)
      throw new NotFoundException(
        `${itemName}에 해당하는 아이템을 찾지 못했습니다.`,
      );

    return plainToInstance(ItemResponseDto, item, {
      excludeExtraneousValues: true,
    });
  }

  async findItemsByCategory(searchItemDto: SearchItemDto) {
    const { category } = searchItemDto;
    if (!category) throw new BadRequestException();
    const items = await this.itemRepository.findItemsByCategory(category);
    return plainToInstance(ItemResponseDto, items);
  }

  async findGrindInfo() {
    const grinds = await this.itemRepository.findGrindInfo();
    return GrindMapper.toResponse(grinds);
  }

  async findItemSetOption() {
    const itemSets = await this.itemRepository.findItemSetOption();
    if (itemSets.length === 0) {
      throw new NotFoundException('세트 옵션이 없습니다.');
    }
    return ItemSetOptionMapper.toResponse(itemSets);
  }

  async getItemRecipe() {
    const recipes = await this.itemRepository.getItemRecipe();

    if (recipes.length === 0) throw new NotFoundException('레시피가 없습니다.');
    return sortRecipe(ItemRecipeMapper.toResponse(recipes));
  }

  async getUnImage() {
    return await this.itemRepository.getUnImageItemsList();
  }

  findStatistics() {
    return this.itemRepository.findStatistics();
  }
}
