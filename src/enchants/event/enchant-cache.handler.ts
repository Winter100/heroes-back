import { CacheInvalidationService } from 'src/redis/cache-invalidation.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EnchantUpdatedEvent } from './enchant-updated.event';

@Injectable()
export class EnchantCacheHandler {
  constructor(
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  @OnEvent(EnchantUpdatedEvent.name)
  async invalidateEnchant(): Promise<void> {
    await this.cacheInvalidationService.invalidateEnchant();
  }
}
