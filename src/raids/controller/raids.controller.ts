import { Controller, Get, Param } from '@nestjs/common';
import {
  RaidResponseDto,
  RaidTableResponseDto,
} from '../dto/raid-response.dto';
import { RaidService } from '../service/raids.service';
import { IntParam } from 'src/common/decorators/int.param';

@Controller('raids')
export class RaidsController {
  constructor(private readonly raidService: RaidService) {}

  // 모든 레이드 조회
  @Get()
  findAll(): Promise<RaidResponseDto[]> {
    return this.raidService.findAllRaid();
  }

  // 프론트엔드 SSG용 조회
  @Get('ssg')
  getRaidSSG() {
    return this.raidService.getRaidSSG();
  }

  // 빠른전투 및 상한용 레이드 조회
  @Get('table')
  findTable(): Promise<RaidTableResponseDto[]> {
    return this.raidService.findTableRaid();
  }

  // 레이드 상세 정보 ID 조회
  @Get('id/:raidId')
  async findOneById(
    @IntParam('raidId', '올바른 RAID ID를 입력해주세요') raidId: number,
  ) {
    return this.raidService.findByOneRaid({ raid: raidId, order: 'id' });
  }

  // 레이드 상세 정보 이름 조회
  @Get('name/:raidName')
  async findOneByName(@Param('raidName') raidName: string) {
    return this.raidService.findByOneRaid({ raid: raidName, order: 'name' });
  }
}
