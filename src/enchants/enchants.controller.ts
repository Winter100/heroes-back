import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { EnchantService } from './enchants.service';
import { EnchantResponseDto } from './dto/enchant-response.dto';

@Controller('enchants')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
export class EnchantsController {
  constructor(private readonly enchantService: EnchantService) {}

  @Get()
  async findAll(): Promise<EnchantResponseDto[]> {
    return await this.enchantService.findAllEnchant();
  }
}
