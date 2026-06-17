import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';
import { ItemService } from './items.service';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CreateItemDto } from './dto/item-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/characters/pipes/image-validation.pipe';
import { ItemResponseDto } from './dto/item-response.dto';
import { SearchItemDto } from './dto/search-item.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateItemDto } from './dto/item-update.dto';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createItem(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ): Promise<{ message: string }> {
    return await this.itemService.createItem(createItemDto, image);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('update')
  async updateItem(
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return await this.itemService.updateItem(updateItemDto, image);
  }

  @Get()
  async findItem(@Query('name') name: string): Promise<ItemResponseDto> {
    return await this.itemService.findItem(name);
  }

  @Get('search')
  async itemInfo(@Query() searchItemDto: SearchItemDto) {
    return await this.itemService.findItemsByCategory(searchItemDto);
  }

  @Get('grind')
  async findGrindInfo() {
    return await this.itemService.findGrindInfo();
  }
}
