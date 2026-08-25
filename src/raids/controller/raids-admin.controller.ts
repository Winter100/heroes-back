import { RaidTitleCreateDto } from '../dto/raid-title-create.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RaidTitle, UserRole } from '@prisma/client';
import { RaidCreateDto } from '../dto/raid-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/characters/pipes/image-validation.pipe';
import { UpdateRaidDto } from '../dto/raid-update.dto';
import { RaidAdminService } from '../service/raids-admin.service';
import { IntParam } from 'src/common/decorators/int.param';
import { RaidDetailUpsertDto } from '../dto/raid-detail-upsert.dto';

@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('raids-admin')
export class RaidsAdminController {
  constructor(private readonly raidAdminService: RaidAdminService) {}

  // 모든 레이드 타이틀 정보 조회
  @Get('titles')
  getRaidTitles() {
    return this.raidAdminService.findAllRaidTitles();
  }

  // 기본 레이드 생성
  @UseInterceptors(FileInterceptor('image'))
  @Post('create')
  createRaid(
    @Body() createRaidDto: RaidCreateDto,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ) {
    return this.raidAdminService.createRaid(createRaidDto, image);
  }

  // 기본 레이드 정보 수정
  @UseInterceptors(FileInterceptor('image'))
  @Post('update/:raidId')
  updateRaid(
    @Body() updateRaidDto: UpdateRaidDto,
    @IntParam('raidId', '올바른 RAIDID를 입력해주세요') raidId: number,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ): Promise<{ message: string }> {
    return this.raidAdminService.updateRaid(raidId, updateRaidDto, image);
  }

  // 레이드 상세 정보 수정
  @Post('detail-upsert/:raidId')
  upsertDetailRaid(
    @Body() raidDetailUpsertDto: RaidDetailUpsertDto,
    @IntParam('raidId', '올바른 RAIDID를 입력해주세요') raidId: number,
  ) {
    return this.raidAdminService.raidDetailUpsert(raidId, raidDetailUpsertDto);
  }

  // 기본 레이드 삭제
  @Delete('delete/:raidId')
  deleteRaid(
    @IntParam('raidId', '올바른 RAIDID를 입력해주세요') raidId: number,
  ) {
    return this.raidAdminService.deleteRaid(raidId);
  }

  // 레이드 명 추가
  @Post('title')
  createRaidTitle(
    @Body() raidTitleCreateDto: RaidTitleCreateDto,
  ): Promise<RaidTitle> {
    return this.raidAdminService.createRaidTitle(raidTitleCreateDto);
  }
}
