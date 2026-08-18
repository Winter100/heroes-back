import { Body, Controller, Get, Post } from '@nestjs/common';
import { EnchantAdminService } from '../service/enchants-admin.service';
import { CreateEnchantDto } from '../dto/create-enchant.dto';
import { UpdateEnchantDto } from '../dto/update-enchant.dto';
import { IntParam } from 'src/common/decorators/int.param';
import { UpsertEnchantDetailDto } from '../dto/upsert-enchant-detail.dto';

@Controller('enchants-admin')
export class EnchantsAdminController {
  constructor(private readonly enchantAdminService: EnchantAdminService) {}

  /**
   * 기본 인챈트 생성
   * @param createEnchantDto
   * @returns
   */
  @Post('create')
  createEnchant(@Body() createEnchantDto: CreateEnchantDto) {
    return this.enchantAdminService.createEnchant(createEnchantDto);
  }

  /**
   * 기본 인챈트 수정
   * @param enchantId
   * @param updateEnchantDto
   * @returns
   */
  @Post('update/:enchantId')
  updateEnchant(
    @IntParam('enchantId', '올바른 ENCHANT ID가 필요합니다') enchantId: number,
    @Body() updateEnchantDto: UpdateEnchantDto,
  ) {
    return this.enchantAdminService.updateEnchant(enchantId, updateEnchantDto);
  }

  /**
   * 인챈트 효과 및 슬롯 설정
   * @param enchantId
   * @param upsertEnchantDetailDto
   * @returns
   */
  @Post('upsert/:enchantId')
  upsertEnchant(
    @IntParam('enchantId', '올바른 ENCHANT ID가 필요합니다') enchantId: number,
    @Body() upsertEnchantDetailDto: UpsertEnchantDetailDto,
  ) {
    return this.enchantAdminService.upsertEnchant(
      enchantId,
      upsertEnchantDetailDto,
    );
  }

  @Get('form')
  getEnchantFormData() {
    return this.enchantAdminService.getEnchantFormData();
  }

  // @Post('drop')
  // createDropRaid(@Body() enchantDropCreateDto: EnchantDropCreateDto) {
  //   return this.enchantAdminService.updateEnchant(enchantDropCreateDto);
  // }
}
