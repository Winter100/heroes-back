import { RaidCreateDto } from './dto/raid-create.dto';
import { ImageUploadService } from './../supabase/imageUpload.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RaidRepository } from './repository/raid.repository';
import { RaidMapper } from './mapper/raid.mapper';
import { RaidResponseDto, RaidTableResponseDto } from './dto/raid-response.dto';
import { RaidTitleCreateDto } from './dto/raid-title-create.dto';
import { Raid, RaidTitle } from '@prisma/client';
import { BUCKET_NAME } from 'src/supabase/constant/bucket';
import { UpdateRaidDto } from './dto/raid-update.dto';
import { raidSort } from './utils/raid.util';

@Injectable()
export class RaidService {
  constructor(
    private readonly raidRepository: RaidRepository,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  async findAllRaid(): Promise<RaidResponseDto[]> {
    const dbRaid = await this.raidRepository.findAllWithRelations();

    if (!dbRaid) throw new NotFoundException('레이드 정보 조회 에러');
    const response = dbRaid.map((raid) => RaidMapper.toBasicResponse(raid));
    return response;
  }

  async findTableRaid(): Promise<RaidTableResponseDto[]> {
    const dbRaid = await this.findAllRaid();

    const response = RaidMapper.toRaidTableResponse(dbRaid);
    return raidSort(response);
  }

  async createRaid(
    raidCreateDto: RaidCreateDto,
    image: Express.Multer.File,
  ): Promise<Raid> {
    if (!image) {
      throw new BadRequestException('이미지는 필수입니다.');
    }

    const imageUrl = await this.imageUploadService.uploadImage(
      image,
      BUCKET_NAME.raidImages,
    );

    try {
      const raidTitle = await this.raidRepository.findRaidTitle(
        raidCreateDto.raidName,
      );

      if (!raidTitle) throw new NotFoundException();

      const raid = await this.raidRepository.createRaid(
        raidTitle.id,
        raidCreateDto,
        imageUrl,
      );

      return raid;
    } catch (e) {
      await this.imageUploadService.deleteImage(imageUrl);
      throw new InternalServerErrorException(e);
    }
  }

  async updateRaid(updateRaidDto: UpdateRaidDto, image?: Express.Multer.File) {
    const battleName = updateRaidDto.name;
    if (!battleName) throw new NotFoundException('전투명이 필요합니다.');

    const battle = await this.raidRepository.findBattle(battleName);
    if (!battle) throw new NotFoundException('존재하지 않는 전투입니다.');

    let imageUrl = '';

    if (image) {
      imageUrl = await this.imageUploadService.uploadImage(
        image,
        BUCKET_NAME.raidImages,
      );
    }

    try {
      const responseBattle = await this.raidRepository.updateBattleImage(
        battleName,
        imageUrl,
      );

      return {
        message: `${responseBattle.battle}을 수정했습니다. ${responseBattle.image}`,
      };
    } catch {
      await this.imageUploadService.deleteImage(imageUrl);
      throw new BadRequestException(`${battleName} 수정에 실패했습니다.`);
    }
  }

  async createRaidTitle(
    raidTitleCreateDto: RaidTitleCreateDto,
  ): Promise<RaidTitle> {
    return await this.raidRepository.createRaidTitle(raidTitleCreateDto.title);
  }
}
