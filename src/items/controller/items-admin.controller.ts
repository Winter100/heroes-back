import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';
import {
  Body,
  Controller,
  Delete,
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
import { CreateItemDto } from '../dto/item-create.dto';
import { UpdateItemDto } from '../dto/item-update.dto';
import { IntParam } from 'src/common/decorators/int.param';

@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('items-admin')
export class ItemAdminController {
  constructor(private readonly itemAdminService: ItemAdminService) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createItem(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ) {
    return await this.itemAdminService.createItem(createItemDto, image);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('update/:itemId')
  async updateItem(
    @Body() updateItemDto: UpdateItemDto,
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
    @UploadedFile()
    image?: Express.Multer.File,
  ) {
    return await this.itemAdminService.updateItem(itemId, updateItemDto, image);
  }

  @Delete('delete/:itemId')
  async deleteItem(
    @IntParam('itemId', '올바른 아이템 ID를 입력해주세요') itemId: number,
  ) {
    return await this.itemAdminService.deleteItem(itemId);
  }
}
