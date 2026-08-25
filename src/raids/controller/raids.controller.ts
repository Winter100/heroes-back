import { Controller, Get } from '@nestjs/common';
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

  // 빠른전투 및 상한용 레이드 조회
  @Get('table')
  findTable(): Promise<RaidTableResponseDto[]> {
    return this.raidService.findTableRaid();
  }

  // 레이드 상세 정보 조회
  @Get(':raidId')
  async findOneById(
    @IntParam('raidId', '올바른 RAID ID를 입력해주세요') raidId: number,
  ) {
    return this.raidService.findOneById(raidId);
  }
}
