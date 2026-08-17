import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/characters/pipes/image-validation.pipe';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ItemAdminService } from '../service/items-admin.service';
import {
  CreateItemDto,
  UpsertStepDto,
  UpsertRecipeDto,
} from '../dto/item-create.dto';
import { UpdateItemDto } from '../dto/item-update.dto';
import { IntParam } from 'src/common/decorators/int.param';

// @Roles(UserRole.ADMIN)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('items-admin')
export class ItemAdminController {
  constructor(private readonly itemAdminService: ItemAdminService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post()
  createItem(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ) {
    return this.itemAdminService.createItem(createItemDto, image);
  }

  // 아이템 기본 정보 수정
  @UseInterceptors(FileInterceptor('image'))
  @Post('update/:itemId')
  updateItem(
    @Body() updateItemDto: UpdateItemDto,
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.itemAdminService.updateItem(itemId, updateItemDto, image);
  }

  // 아이템 강화 별 스텟 설정
  @Post('create/step/:itemId')
  createStepItem(
    @Body() upsertStepDto: UpsertStepDto,
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
  ) {
    return this.itemAdminService.createStepItem(itemId, upsertStepDto);
  }

  @Post('update/step/:itemId')
  updateStepItem(
    @Body() upsertStepDto: UpsertStepDto,
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
  ) {
    return this.itemAdminService.updateStepItem(itemId, upsertStepDto);
  }

  @Delete('delete/step/:stepId')
  deleteStepItem(
    @IntParam('stepId', '올바른 stepId를 입력해주세요') stepId: number,
  ) {
    return this.itemAdminService.deleteStepItem(stepId);
  }

  @Get('stats')
  getStatsId() {
    return this.itemAdminService.getStatsId();
  }

  @Get('basic-id')
  getBasicId() {
    return this.itemAdminService.getBasicId();
  }

  @Delete('delete/:itemId')
  deleteItem(
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
  ) {
    return this.itemAdminService.deleteItem(itemId);
  }

  @Post('recipe/:stepId')
  createRecipe(
    @IntParam('stepId', '올바른 stepId를 입력해주세요') stepId: number,
    @Body() upsertRecipeDto: UpsertRecipeDto,
  ) {
    return this.itemAdminService.upsertRecipe(stepId, upsertRecipeDto);
  }

  /**
   * --26.08.15 아이템 스탭 받아서 CRUD 처리하기
   *
   * 1. 레시피 CRUD
   * - 프론트에서 레시피 추가 누르면 모든 장비 불러와서 거기서 아이템 ID와 수량
   *   체크해서보내주기
   *
   * 2. 장비 세트 옵션 CRUD
   * - 프론트에서 세트 옵션 추가 누르면 레벨과 세트 추가, 수정 가능하게 하기
   *
   * 3. 연마 CRUD
   */
}
