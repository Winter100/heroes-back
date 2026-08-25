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

  /**
   * 특정 아이템 조회
   * @param id
   * @returns
   */
  async findItemById(id: number): Promise<ItemWithRelations> {
    const item = await this.itemRepository.findItemById(id);

    if (!item)
      throw new NotFoundException(`${id}에 해당하는 아이템을 찾지 못했습니다.`);

    return ItemMapper.toItemDetail(item);
  }

  /**
   * 특정 아이템의 스텝 조회
   * @param stepId
   * @returns
   */
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

  /**
   * 아이템 아이디로 자신의 모든 상세 스텟 조회
   * @param itemId
   * @returns
   */
  async findStepByItemId(itemId: number) {
    const item = await this.itemRepository.findStepByItemId(itemId);

    if (!item)
      throw new NotFoundException(
        `${itemId}에 해당하는 스탭을 찾지 못했습니다`,
      );

    return ItemMapper.toDetailStep(item);
  }

  /**
   * 모든 아이템 기본 조회
   * @returns
   */
  async findAllItems() {
    const items = await this.itemRepository.findAllItems();
    if (!items) throw new NotFoundException('아이템이 없습니다.');
    return items;
  }

  /**
   * 모든 아이템 상세 정보 조회
   * @returns
   */
  async findAllSteps() {
    const items = await this.itemRepository.findAllSteps();
    if (!items) throw new NotFoundException('아이템이 없습니다.');
    return items;
  }

  /**
   * 아이템 이름으로 조회
   * @param itemName
   * @returns
   */
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

  /**
   * 카테고리로 아이템 조회
   * @param searchItemDto
   * @returns
   */
  async findItemsByCategory(searchItemDto: SearchItemDto) {
    const { category } = searchItemDto;
    if (!category) throw new BadRequestException();
    const items = await this.itemRepository.findItemsByCategory(category);
    return plainToInstance(ItemResponseDto, items);
  }

  /**
   * 모든 아이템 연마 정보 조회
   * @returns
   */
  async findGrindInfo() {
    const grinds = await this.itemRepository.findGrindInfo();
    return GrindMapper.toResponse(grinds);
  }

  /**
   * 모든 아이템 세트 옵션 조회
   * @returns
   */
  async findItemSetOption() {
    const itemSets = await this.itemRepository.findItemSetOption();
    if (itemSets.length === 0) {
      throw new NotFoundException('세트 옵션이 없습니다.');
    }
    return ItemSetOptionMapper.toResponse(itemSets);
  }

  /**
   * 모든 아이템 레시피 조회
   * @returns
   */
  async getItemRecipe() {
    const recipes = await this.itemRepository.getItemRecipe();

    if (recipes.length === 0) throw new NotFoundException('레시피가 없습니다.');
    return sortRecipe(ItemRecipeMapper.toResponse(recipes));
  }

  /**
   * 이미지가 없는 아이템 조회
   * @returns
   */
  async getUnImage() {
    return await this.itemRepository.getUnImageItemsList();
  }

  /**
   * 아이템용 통계 정보 조회
   * @returns
   */
  findStatistics() {
    return this.itemRepository.findStatistics();
  }
}
