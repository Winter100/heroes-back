import { RaidService } from './raids.service';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { RaidResponseDto, RaidTableResponseDto } from './dto/raid-response.dto';

@Controller('raids')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ excludeExtraneousValues: true })
export class RaidsController {
  constructor(private readonly raidService: RaidService) {}

  @Get()
  async findAll(): Promise<RaidResponseDto[]> {
    return this.raidService.findAllRaid();
  }

  @Get('table')
  async findTable(): Promise<RaidTableResponseDto[]> {
    return this.raidService.findTableRaid();
  }
}
