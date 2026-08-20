import { Injectable, NotFoundException } from '@nestjs/common';
import { RaidRepository } from '../repository/raid.repository';
import {
  RaidResponseDto,
  RaidTableResponseDto,
} from '../dto/raid-response.dto';
import { RaidMapper } from '../mapper/raid.mapper';
import { raidSort } from '../utils/raid.util';

@Injectable()
export class RaidService {
  constructor(private readonly raidRepository: RaidRepository) {}

  async findAllRaid(): Promise<RaidResponseDto[]> {
    const dbRaid = await this.raidRepository.findAllWithRelations();
    if (!dbRaid) throw new NotFoundException('레이드 정보 조회 에러');
    return dbRaid.map((raid) => RaidMapper.toBasicResponse(raid));
  }

  async findOneById(raidId: number) {
    const dbRaid = await this.raidRepository.findRaidById(raidId);
    if (!dbRaid) throw new NotFoundException('레이드 정보 조회 에러');
    return RaidMapper.toBasicResponse(dbRaid);
  }

  async findTableRaid(): Promise<RaidTableResponseDto[]> {
    const dbRaid = await this.findAllRaid();

    const response = RaidMapper.toRaidTableResponse(dbRaid);
    return raidSort(response);
  }
}
