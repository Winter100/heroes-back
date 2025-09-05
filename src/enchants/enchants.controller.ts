import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { EnchantService } from './enchants.service';
import { EnchantResponseDto } from './dto/enchant-response.dto';
import { EnchantDropCreateDto } from './dto/enchant-drop-create.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
@Controller('enchants')
export class EnchantsController {
  constructor(private readonly enchantService: EnchantService) {}

  @Get()
  async findAll(): Promise<EnchantResponseDto[]> {
    return await this.enchantService.findAllEnchant();
  }

  @Get('drop')
  async findEnchantDrop() {
    return await this.enchantService.findEnchantDrop();
  }

  @Post('drop')
  async createDropRaid(@Body() enchantDropCreateDto: EnchantDropCreateDto) {
    return await this.enchantService.updateEnchant(enchantDropCreateDto);
  }
}
