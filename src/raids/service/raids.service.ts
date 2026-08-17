import { Injectable, NotFoundException } from '@nestjs/common';
import { RaidRepository } from '../repository/raid.repository';
import { ImageUploadService } from 'src/supabase/imageUpload.service';
import {
  RaidResponseDto,
  RaidTableResponseDto,
} from '../dto/raid-response.dto';
import { RaidMapper } from '../mapper/raid.mapper';
import { raidSort } from '../utils/raid.util';

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
}
