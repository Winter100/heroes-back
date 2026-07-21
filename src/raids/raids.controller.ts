import { RaidTitleCreateDto } from './dto/raid-title-create.dto';
import { RaidService } from './raids.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RaidResponseDto, RaidTableResponseDto } from './dto/raid-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-token.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Raid, RaidTitle, UserRole } from '@prisma/client';
import { RaidCreateDto } from './dto/raid-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/characters/pipes/image-validation.pipe';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
@Controller('raids')
export class RaidsController {
  constructor(private readonly raidService: RaidService) {}

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createRaid(
    @Body() raidCreateDto: RaidCreateDto,
    @UploadedFile(ImageValidationPipe) image: Express.Multer.File,
  ): Promise<Raid> {
    return await this.raidService.createRaid(raidCreateDto, image);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('title')
  async createRaidTitle(
    @Body() raidTitleCreateDto: RaidTitleCreateDto,
  ): Promise<RaidTitle> {
    return await this.raidService.createRaidTitle(raidTitleCreateDto);
  }

  @Get()
  async findAll(): Promise<RaidResponseDto[]> {
    return await this.raidService.findAllRaid();
  }

  @Get('table')
  async findTable(): Promise<RaidTableResponseDto[]> {
    return await this.raidService.findTableRaid();
  }

  @Post('drops')
  addItemDrop() {
    return;
  }
}
