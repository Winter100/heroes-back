import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { EnchantResponseDto } from '../dto/enchant-response.dto';
import { EnchantQueryDto } from '../dto/enchant-query.dto';
import { EnchantService } from '../service/enchants.service';
import { IntParam } from 'src/common/decorators/int.param';

// @UseGuards(ThrottlerGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
@Controller('enchants')
export class EnchantsController {
  constructor(private readonly enchantService: EnchantService) {}

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

  @Get(':enchantId')
  async findEnchantById(
    @IntParam('enchantId', '올바른 ENCHANT ID를 입력해주세요.')
    enchantId: number,
  ) {
    return await this.enchantService.findEnchantById(enchantId);
  }
}
