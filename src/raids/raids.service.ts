import { Injectable, NotFoundException } from '@nestjs/common';
import { RaidRepository } from './repository/raid.repository';
import { RaidMapper } from './mapper/raid.mapper';
import { RaidResponseDto, RaidTableResponseDto } from './dto/raid-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RaidService {
  constructor(private readonly raidRepository: RaidRepository) {}

  async findAllRaid(): Promise<RaidResponseDto[]> {
    const dbRaid = await this.raidRepository.findAllWithRelations();

    if (!dbRaid) throw new NotFoundException();
    const response = dbRaid.map((raid) => RaidMapper.toBasicResponse(raid));
    return plainToInstance(RaidResponseDto, response);
  }

  async findTableRaid(): Promise<RaidTableResponseDto[]> {
    const dbRaid = await this.findAllRaid();

    const response = RaidMapper.toRaidTableResponse(dbRaid);
    return plainToInstance(RaidTableResponseDto, response);
  }
}
