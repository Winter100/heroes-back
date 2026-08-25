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
import { BUCKET_NAME } from 'src/supabase/constant/bucket';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class ItemAdminService {
  constructor(
    @InjectPinoLogger(ItemAdminService.name)
    private readonly logger: PinoLogger,
    private readonly itemRepository: ItemRepository,
    private readonly imageUploadService: ImageUploadService,
    private readonly itemService: ItemService,
  ) {}

  /**
   * 아이템 기본 생성
   * @param createItemDto
   * @param image
   * @returns
   */
  async createItem(createItemDto: CreateItemDto, image?: Express.Multer.File) {
    this.logger.info({ itemName: createItemDto.name }, 'create item start');
    const imageUrl: string | undefined = image
      ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.items)
      : undefined;

    try {
      const item = await this.itemRepository.create(createItemDto, imageUrl);

      this.logger.info(
        { itemName: createItemDto.name },
        'create item succeeded',
      );
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

  /**
   * 아이템 기본 정보 수정
   * @param itemId
   * @param updateItemDto
   * @param image
   * @returns
   */
  async updateItem(
    itemId: number,
    updateItemDto: UpdateItemDto,
    image?: Express.Multer.File,
  ) {
    this.logger.info({ itemName: updateItemDto.name }, 'update item start');
    const findItem = await this.itemService.findItemById(itemId);

    const imageUrl: string | undefined = image
      ? await this.imageUploadService.uploadImage(image, BUCKET_NAME.items)
      : undefined;

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
      this.logger.info(
        { itemName: updateItemDto.name },
        'update item succeeded',
      );
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

  /**
   * 아이템 상세 정보 생성
   * @param itemId
   * @param createStepDto
   * @returns
   */
  async createStepItem(itemId: number, createStepDto: UpsertStepDto) {
    this.logger.info(
      { itemId, stepid: createStepDto?.stepId },
      'create step item start',
    );
    const findItem = await this.itemService.findItemById(itemId);

    const findStepData = await this.itemRepository.findStepByItemIdAndStepName(
      itemId,
      createStepDto.steps?.stepName,
    );

    if (findStepData)
      throw new BadRequestException('이미 존재하는 강화 단계입니다');

    await this.itemRepository.createStep(findItem, createStepDto);

    this.logger.info(
      { itemId, stepid: createStepDto?.stepId },
      'create step item succeeded',
    );
    return { message: `${findItem.name} 아이템 강화 등록 성공` };
  }

  /**
   * 아이템 상세 정보 수정
   * @param itemId
   * @param updateStepDto
   * @returns
   */
  async updateStepItem(itemId: number, updateStepDto: UpsertStepDto) {
    this.logger.info(
      { itemId, stepid: updateStepDto?.stepId },
      'update step item start',
    );
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

    this.logger.info(
      { itemId, stepid: updateStepDto?.stepId },
      'update step item succeeded',
    );
    return { message: `${updateStepDto.stepId} 아이템 강화 수정 성공` };
  }

  /**
   * 아이템 상세 강화 정보 삭제
   * @param stepId
   * @returns
   */
  async deleteStepItem(stepId: number) {
    this.logger.info({ stepId }, 'delete step item start');
    await this.itemRepository.deleteStep(stepId);
    this.logger.info({ stepId }, 'delete step item succeeded');
    return { message: `${stepId} 아이템 강화 삭제 성공` };
  }

  /**
   * 모든 아이템 스텟 조회
   * @returns
   */
  getStatsId() {
    return this.itemRepository.getStatsId();
  }

  /**
   * 아이템 생성시 필요한 폼 정보
   * @returns
   */
  async getBasicId() {
    const [category, tier, slot] = await Promise.all([
      this.itemRepository.getCategory(),
      this.itemRepository.getTier(),
      this.itemRepository.getSlots(),
    ]);

    return { category, tier, slot };
  }

  /**
   * 기본 아이템 삭제
   * @param itemId
   * @returns
   */
  async deleteItem(itemId: number) {
    this.logger.info({ itemId }, 'delete item start');
    const findItem = await this.itemService.findItemById(itemId);
    await this.itemRepository.delete(itemId);
    if (findItem.image) {
      try {
        await this.imageUploadService.deleteImage(findItem.image);
      } catch (error) {
        console.error(`스토리지 이미지 삭제 실패 ${itemId}`, error);
      }
    }

    this.logger.info({ itemId }, 'delete item succeeded');
    return { message: '아이템이 성공적으로 삭제되었습니다.' };
  }

  /**
   * 아이템 제작 레시피 변경
   * @param stepId
   * @param upsertRecipeDto
   * @returns
   */
  async upsertRecipe(stepId: number, upsertRecipeDto: UpsertRecipeDto) {
    this.logger.info({ stepId }, 'upsert recipe start');
    await this.itemService.findStepByStepId(stepId);
    this.logger.info({ stepId }, 'upsert recipe succeeded');
    return this.itemRepository.upsertRecipe(stepId, upsertRecipeDto);
  }
}
