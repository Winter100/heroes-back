import { Controller, Get, Post } from '@nestjs/common';
import {
  RaidResponseDto,
  RaidTableResponseDto,
} from '../dto/raid-response.dto';
import { RaidService } from '../service/raids.service';

@Controller('raids')
export class RaidsController {
  constructor(private readonly raidService: RaidService) {}

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
