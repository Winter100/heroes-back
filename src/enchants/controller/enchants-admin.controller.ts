import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { EnchantAdminService } from '../service/enchants-admin.service';
import { CreateEnchantDto } from '../dto/create-enchant.dto';
import { UpdateEnchantDto } from '../dto/update-enchant.dto';
import { IntParam } from 'src/common/decorators/int.param';
import { UpsertEnchantDetailDto } from '../dto/upsert-enchant-detail.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enchants-admin')
export class EnchantsAdminController {
  constructor(private readonly enchantAdminService: EnchantAdminService) {}

  // 인챈트 생성 폼에 필요한 데이터
  @Get('form')
  getEnchantFormData() {
    return this.enchantAdminService.getEnchantFormData();
  }

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

  // 인챈트 삭제
  @Delete('delete/:enchantId')
  deleteEnchant(
    @IntParam('enchantId', '올바른 ENCHANT ID가 필요합니다') enchantId: number,
  ) {
    return this.enchantAdminService.deleteEnchant(enchantId);
  }
}
