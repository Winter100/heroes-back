import { ItemService } from './items.service';
import { ImageUploadService } from 'src/supabase/imageUpload.service';
import { CreateItemDto } from '../dto/item-create.dto';
import { ItemRepository } from './../repository/item.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
// import { BUCKET_NAME } from 'src/supabase/constant/bucket';
import { UpdateItemDto } from '../dto/item-update.dto';

@Injectable()
export class ItemAdminService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly imageUploadService: ImageUploadService,
    private readonly itemService: ItemService,
  ) {}

  async createItem(createItemDto: CreateItemDto, image?: Express.Multer.File) {
    // const imageUrl: string | undefined = image
    //   ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.items)
    //   : undefined;
    const imageUrl = undefined;

    try {
      const item = await this.itemRepository.create(createItemDto, imageUrl);

      return { message: `${item.name}을 등록했습니다.` };
    } catch {
      // await this.imageUploadService.deleteImage(imageUrl);
      throw new BadRequestException();
    }
  }

  async updateItem(
    itemId: number,
    updateItemDto: UpdateItemDto,
    image?: Express.Multer.File,
  ) {
    const findItem = await this.itemService.findItemById(itemId);

    // const imageUrl: string | undefined = image
    //   ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.items)
    //   : undefined;
    const imageUrl = undefined;

    try {
      const updateItem = await this.itemRepository.update(
        itemId,
        updateItemDto,
        imageUrl,
      );

      if (imageUrl && findItem.image) {
        this.imageUploadService.deleteImage(findItem.image).catch((error) => {
          console.error(`기존 이미지 삭제 실패 (itemId: ${itemId}):`, error);
        });
      }

      return { message: `${updateItem.name}을 수정했습니다.` };
    } catch (error) {
      console.error(error instanceof Error ? error.message : `알 수 없는 에러`);
      if (imageUrl) {
        await this.imageUploadService.deleteImage(imageUrl);
      }
      throw new BadRequestException(`${findItem.name} 수정에 실패했습니다.`);
    }
  }

  async deleteItem(itemId: number) {
    const findItem = await this.itemService.findItemById(itemId);
    await this.itemRepository.delete(itemId);
    if (findItem.image) {
      try {
        await this.imageUploadService.deleteImage(findItem.image);
      } catch (error) {
        // 이미지 삭제 실패시 추적할 수 있는 방법 필요
        console.error(`스토리지 이미지 삭제 실패 ${itemId}`, error);
      }
    }

    return { message: '아이템이 성공적으로 삭제되었습니다.' };
  }
}
