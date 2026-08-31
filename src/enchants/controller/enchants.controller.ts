import { Controller, Get, Param, Query } from '@nestjs/common';
import { EnchantResponseDto } from '../dto/enchant-response.dto';
import { EnchantQueryDto } from '../dto/enchant-query.dto';
import { EnchantService } from '../service/enchants.service';
import { IntParam } from 'src/common/decorators/int.param';

@Controller('enchants')
export class EnchantsController {
  constructor(private readonly enchantService: EnchantService) {}

  // 모든 인챈트 조회
  @Get()
  async findAll(
    @Query() query: EnchantQueryDto,
  ): Promise<EnchantResponseDto[]> {
    return await this.enchantService.findAllEnchant(query.category);
  }

  // 모든 인챈트 가격 조회
  @Get('price')
  async findPriceAll() {
    return await this.enchantService.findAllPrice();
  }

  // 인챈트와 가격 모두 조회
  @Get('table')
  async getEnchantTable() {
    return await this.enchantService.getEnchantTable();
  }

  // 프론트엔드용 SSG
  @Get('ssg')
  async enchantSSG() {
    return await this.enchantService.getEnchantSSG();
  }

  // 특정 인챈트 아이디 조회
  @Get('id/:enchantId')
  async findEnchantById(
    @IntParam('enchantId', '올바른 ENCHANT ID를 입력해주세요.')
    enchantId: number,
  ) {
    return await this.enchantService.findEnchantOneBy({
      enchant: enchantId,
      order: 'id',
    });
  }

  // 특정 인챈트 이름 조회
  @Get('name/:enchantName')
  async findEnchantByName(@Param('enchantName') enchantName: string) {
    return await this.enchantService.findEnchantOneBy({
      enchant: enchantName,
      order: 'name',
    });
  }
}
