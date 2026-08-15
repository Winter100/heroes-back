import { ItemService } from './items.service';
import { ImageUploadService } from 'src/supabase/imageUpload.service';
import {
  CreateItemDto,
  UpsertRecipeDto,
  UpsertStepDto,
} from '../dto/item-create.dto';
import { ItemRepository } from './../repository/item.repository';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
// import { BUCKET_NAME } from 'src/supabase/constant/bucket';
import { UpdateItemDto } from '../dto/item-update.dto';
import { Prisma } from '@prisma/client';

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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('이미 존재하는 이름입니다.');
      }
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
      if (imageUrl) {
        await this.imageUploadService.deleteImage(imageUrl);
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('이미 존재하는 이름입니다.');
      }
      throw new BadRequestException();
    }
  }

  async createStepItem(itemId: number, createStepDto: UpsertStepDto) {
    const findItem = await this.itemService.findItemById(itemId);

    const findStepData = await this.itemRepository.findStepByItemIdAndStepName(
      itemId,
      createStepDto.steps?.stepName,
    );

    if (findStepData)
      throw new BadRequestException('이미 존재하는 강화 단계입니다');

    await this.itemRepository.createStep(findItem, createStepDto);

    return { message: `${findItem.name} 아이템 강화 등록 성공` };
  }

  async updateStepItem(itemId: number, updateStepDto: UpsertStepDto) {
    if (!updateStepDto.stepId)
      throw new BadRequestException('강화 아이디가 필요합니다.');

    // 자기 자신의 값만 바꿔도 여기에 걸려서 안됨.
    const findStepData = await this.itemRepository.findStepByItemIdAndStepName(
      itemId,
      updateStepDto.steps.stepName,
    );

    if (findStepData && findStepData.id !== updateStepDto.stepId)
      throw new BadRequestException('이미 존재하는 강화 단계입니다');

    await this.itemRepository.updateStep(updateStepDto.stepId, updateStepDto);

    return { message: `${updateStepDto.stepId} 아이템 강화 수정 성공` };
  }

  async deleteStepItem(stepId: number) {
    await this.itemRepository.deleteStep(stepId);

    return { message: `${stepId} 아이템 강화 삭제 성공` };
  }

  getStatsId() {
    return this.itemRepository.getStatsId();
  }

  async deleteItem(itemId: number) {
    const findItem = await this.itemService.findItemById(itemId);
    await this.itemRepository.delete(itemId);
    if (findItem.image) {
      try {
        // await this.imageUploadService.deleteImage(findItem.image);
      } catch (error) {
        console.error(`스토리지 이미지 삭제 실패 ${itemId}`, error);
      }
    }

    return { message: '아이템이 성공적으로 삭제되었습니다.' };
  }

  async upsertRecipe(stepId: number, upsertRecipeDto: UpsertRecipeDto) {
    await this.itemService.findStepByStepId(stepId);
    return this.itemRepository.upsertRecipe(stepId, upsertRecipeDto);
  }
}
