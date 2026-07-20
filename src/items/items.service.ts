import { ItemRepository } from './repository/item.repository';
import { ImageUploadService } from './../supabase/imageUpload.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/item-create.dto';
import { BUCKET_NAME } from 'src/supabase/constant/bucket';
import { plainToInstance } from 'class-transformer';
import { ItemResponseDto } from './dto/item-response.dto';
import { SearchItemDto } from './dto/search-item.dto';
import { UpdateItemDto } from './dto/item-update.dto';
import { GrindMapper } from './mapper/grind-mapper';
import { ItemSetOptionMapper } from './mapper/item-set-option-mapper';
import { ItemRecipeMapper } from './mapper/item-recipe-mapper';
import { sortRecipe } from './utils/utils';
// import { ItemRecipeMapper } from './mapper/item-recipe-mapper';

@Injectable()
export class ItemService {
  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly itemRepository: ItemRepository,
  ) {}

  async createItem(
    createItemDto: CreateItemDto,
    image: Express.Multer.File,
  ): Promise<{ message: string }> {
    const imageUrl = await this.imageUploadService.uploadImage(
      image,
      BUCKET_NAME.items,
    );

    try {
      const item = await this.itemRepository.create(createItemDto, imageUrl);

      return { message: `${item.name}을 등록했습니다.` };
    } catch {
      await this.imageUploadService.deleteImage(imageUrl);
      throw new BadRequestException();
    }
  }

  async updateItem(updateItemDto: UpdateItemDto, image?: Express.Multer.File) {
    const item = await this.itemRepository.findItem(updateItemDto.name);
    if (!item) throw new NotFoundException('존재하지 않는 아이템입니다.');

    let imageUrl = '';

    if (image) {
      imageUrl = await this.imageUploadService.uploadImage(
        image,
        BUCKET_NAME.items,
      );
    }

    try {
      const item = await this.itemRepository.update(updateItemDto, imageUrl);

      return { message: `${item.name}을 수정했습니다.` };
    } catch {
      await this.imageUploadService.deleteImage(imageUrl);
      throw new BadRequestException(`${item.name} 수정에 실패했습니다.`);
    }
  }

  async findItem(name: string): Promise<ItemResponseDto> {
    const item = await this.itemRepository.findItem(name);

    if (!item)
      throw new NotFoundException(
        `${name}에 해당하는 아이템을 찾지 못했습니다.`,
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
}
