import { CacheInvalidationService } from 'src/redis/cache-invalidation.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RaidUpdatedEvent } from './raid-updated.event';

@Injectable()
export class RaidCacheHandler {
  constructor(
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  @OnEvent(RaidUpdatedEvent.name)
  async invalidateRaid() {
    await this.cacheInvalidationService.invalidateRaid();
  }
}
