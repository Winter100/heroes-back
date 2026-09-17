import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisKeys } from './redis-keys.constant';

@Injectable()
export class CacheInvalidationService {
  constructor(private readonly redisService: RedisService) {}

  async invalidateCharacter(): Promise<void> {
    const keys: string[] = [
      RedisKeys.characterList(),
      RedisKeys.characterStatistics(),
    ];

    await this.redisService.del(keys);
  }

  async invalidateItem(): Promise<void> {
    const keys: string[] = [RedisKeys.itemList(), RedisKeys.itemStatistics()];

    await this.redisService.del(keys);
  }

  async invalidateRaid(): Promise<void> {
    const keys: string[] = [RedisKeys.raidList(), RedisKeys.raidStatistics()];
    await this.redisService.del(keys);
  }

  async invalidateEnchant(): Promise<void> {
    const keys: string[] = [
      RedisKeys.enchantList(),
      RedisKeys.enchantStatistics(),
    ];
    await this.redisService.del(keys);
  }
}
