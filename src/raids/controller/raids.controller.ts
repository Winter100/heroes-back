import { Controller, Get, Post } from '@nestjs/common';
import {
  RaidResponseDto,
  RaidTableResponseDto,
} from '../dto/raid-response.dto';
import { RaidService } from '../service/raids.service';
import { IntParam } from 'src/common/decorators/int.param';

@Controller('raids')
export class RaidsController {
  constructor(private readonly raidService: RaidService) {}

  @Get()
  findAll(): Promise<RaidResponseDto[]> {
    return this.raidService.findAllRaid();
  }

  @Get('table')
  findTable(): Promise<RaidTableResponseDto[]> {
    return this.raidService.findTableRaid();
  }

  @Post('drops')
  addItemDrop() {
    return;
  }

  @Get(':raidId')
  async findOneById(
    @IntParam('raidId', '올바른 RAID ID를 입력해주세요') raidId: number,
  ) {
    return this.raidService.findOneById(raidId);
  }
}
