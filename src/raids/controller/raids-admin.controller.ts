import { RaidTitleCreateDto } from '../dto/raid-title-create.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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

// @Roles(UserRole.ADMIN)
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('raids-admin')
export class RaidsAdminController {
  constructor(private readonly raidAdminService: RaidAdminService) {}

  @Get('titles')
  getRaidTitles() {
    return this.raidAdminService.findAllRaidTitles();
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('create')
  createRaid(
    @Body() createRaidDto: RaidCreateDto,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ) {
    return this.raidAdminService.createRaid(createRaidDto, image);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('update/:raidId')
  updateRaid(
    @Body() updateRaidDto: UpdateRaidDto,
    @IntParam('raidId', '올바른 RAIDID를 입력해주세요') raidId: number,
    @UploadedFile(ImageValidationPipe) image?: Express.Multer.File,
  ): Promise<{ message: string }> {
    return this.raidAdminService.updateRaid(raidId, updateRaidDto, image);
  }

  @Post('detail-upsert/:raidId')
  upsertDetailRaid(
    @Body() raidDetailUpsertDto: RaidDetailUpsertDto,
    @IntParam('raidId', '올바른 RAIDID를 입력해주세요') raidId: number,
  ) {
    return this.raidAdminService.raidDetailUpsert(raidId, raidDetailUpsertDto);
  }

  @Delete('delete/:raidId')
  deleteRaid(
    @IntParam('raidId', '올바른 RAIDID를 입력해주세요') raidId: number,
  ) {
    return this.raidAdminService.deleteRaid(raidId);
  }

  @Post('title')
  createRaidTitle(
    @Body() raidTitleCreateDto: RaidTitleCreateDto,
  ): Promise<RaidTitle> {
    return this.raidAdminService.createRaidTitle(raidTitleCreateDto);
  }
}
