import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EnchantService } from './enchants.service';
import { EnchantResponseDto } from './dto/enchant-response.dto';
import { EnchantDropCreateDto } from './dto/enchant-drop-create.dto';
import { EnchantQueryDto } from './dto/enchant-query.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
@Controller('enchants')
export class EnchantsController {
  constructor(private readonly enchantService: EnchantService) {}

  @Post('drop')
  async createDropRaid(@Body() enchantDropCreateDto: EnchantDropCreateDto) {
    return await this.enchantService.updateEnchant(enchantDropCreateDto);
  }

  @Get()
  async findAll(
    @Query() query: EnchantQueryDto,
  ): Promise<EnchantResponseDto[]> {
    return await this.enchantService.findAllEnchant(query.category);
  }

  @Get('price')
  async findPriceAll() {
    return await this.enchantService.findAllPrice();
  }
}
