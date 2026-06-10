import { RaidCreateDto } from './dto/raid-create.dto';
import { ImageUploadService } from './../supabase/imageUpload.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RaidRepository } from './repository/raid.repository';
import { RaidMapper } from './mapper/raid.mapper';
import { RaidResponseDto, RaidTableResponseDto } from './dto/raid-response.dto';
import { RaidTitleCreateDto } from './dto/raid-title-create.dto';
import { RAID_IMAGE_BUCKET } from 'src/supabase/constant/burket';
import { Raid, RaidTitle } from '@prisma/client';

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
    return response;
  }

  async createRaid(
    raidCreateDto: RaidCreateDto,
    image: Express.Multer.File,
  ): Promise<Raid> {
    const imageUrl = await this.imageUploadService.uploadImage(
      image,
      RAID_IMAGE_BUCKET,
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

  async createRaidTitle(
    raidTitleCreateDto: RaidTitleCreateDto,
  ): Promise<RaidTitle> {
    return await this.raidRepository.createRaidTitle(raidTitleCreateDto.title);
  }
}
