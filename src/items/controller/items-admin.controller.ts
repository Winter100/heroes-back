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

@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('items-admin')
export class ItemAdminController {
  constructor(private readonly itemAdminService: ItemAdminService) {}

  // 기본 아이템 생성
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

  // 아이템 강화 별 스텟 추가
  @Post('create/step/:itemId')
  createStepItem(
    @Body() upsertStepDto: UpsertStepDto,
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
  ) {
    return this.itemAdminService.createStepItem(itemId, upsertStepDto);
  }

  // 아이템 강화 별 스텟 수정
  @Post('update/step/:itemId')
  updateStepItem(
    @Body() upsertStepDto: UpsertStepDto,
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
  ) {
    return this.itemAdminService.updateStepItem(itemId, upsertStepDto);
  }

  // 아이템 강화 별 스텟 삭제
  @Delete('delete/step/:stepId')
  deleteStepItem(
    @IntParam('stepId', '올바른 stepId를 입력해주세요') stepId: number,
  ) {
    return this.itemAdminService.deleteStepItem(stepId);
  }

  // 아이템 강화 별 스텟 조회
  @Get('stats')
  getStatsId() {
    return this.itemAdminService.getStatsId();
  }

  // 아이템 생성시 필요한 폼 정보
  @Get('basic-id')
  getBasicId() {
    return this.itemAdminService.getBasicId();
  }

  // 아이템 삭제
  @Delete('delete/:itemId')
  deleteItem(
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
  ) {
    return this.itemAdminService.deleteItem(itemId);
  }

  // 아이템 레시피 조회
  @Post('recipe/:stepId')
  createRecipe(
    @IntParam('stepId', '올바른 stepId를 입력해주세요') stepId: number,
    @Body() upsertRecipeDto: UpsertRecipeDto,
  ) {
    return this.itemAdminService.upsertRecipe(stepId, upsertRecipeDto);
  }
}
