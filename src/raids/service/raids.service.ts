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

  /**
   * 모든 레이드 정보 조회
   * @returns
   */
  async findAllRaid(): Promise<RaidResponseDto[]> {
    const dbRaid = await this.raidRepository.findAllWithRelations();
    if (!dbRaid) throw new NotFoundException('레이드 정보 조회 에러');
    return dbRaid.map((raid) => RaidMapper.toBasicResponse(raid));
  }

  /**
   * 레이드 아이디 또는 전투명으로 조회
   * @param raidId
   * @returns
   */
  async findByOneRaid(
    param: { raid: number; order: 'id' } | { raid: string; order: 'name' },
  ) {
    const raid =
      param.order === 'id'
        ? await this.raidRepository.findRaidById(param.raid)
        : await this.raidRepository.findRaidByName(param.raid);

    if (!raid) throw new NotFoundException('레이드 정보 조회 에러');
    return RaidMapper.toBasicResponse(raid);
  }

  /**
   * 빠른전투 및 상한용 레이드 조회
   * @returns
   */
  async findTableRaid(): Promise<RaidTableResponseDto[]> {
    const dbRaid = await this.findAllRaid();

    const response = RaidMapper.toRaidTableResponse(dbRaid);
    return raidSort(response);
  }

  async getRaidSSG() {
    const raids = await this.findTableRaid();

    const filteredData = raids.filter((raid) => raid.raid_name !== '미분류');

    const names = [
      ...new Set(filteredData.flatMap((m) => m.monsters.map((r) => r.battle))),
    ];

    return names;
  }

  /**
   * 레이드 통계
   * @returns
   */
  findStatistics() {
    return this.raidRepository.findStatistics();
  }
}
