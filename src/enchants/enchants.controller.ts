import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { EnchantService } from './enchants.service';
import { EnchantResponseDto } from './dto/enchant-response.dto';
import { EnchantDropCreateDto } from './dto/enchant-drop-create.dto';
import { EnchantQueryDto } from './dto/enchant-query.dto';

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

  // @Get('drop')
  // async findEnchantDrop() {
  //   return await this.enchantService.findEnchantDrop();
  // }
}
