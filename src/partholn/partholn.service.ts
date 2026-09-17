import { RedisService } from 'src/redis/redis.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PartholnRepository } from './repository/partholn.repository';
import { PartholnMapper } from './mapper/partholn-mapper';
import { RedisKeys } from 'src/redis/redis-keys.constant';
import { PartholnType } from './constant/partholn';

@Injectable()
export class PartholnService {
  constructor(
    private readonly partholnRepository: PartholnRepository,
    private readonly redisService: RedisService,
  ) {}

  async findAll(): Promise<PartholnType[]> {
    return this.redisService.getOrSet(
      RedisKeys.partholnList(),
      60 * 300,
      async () => {
        const data = await this.partholnRepository.findPartholn();
        if (data.length === 0)
          throw new NotFoundException('파르홀른 데이터를 찾지 못했습니다.');

        return PartholnMapper.toResponse(data);
      },
    );
  }
}
