import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ItemUpdatedEvent } from 'src/items/event/item-updated.event';
import { CacheInvalidationService } from 'src/redis/cache-invalidation.service';

@Injectable()
export class ItemCacheHandler {
  constructor(
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  @OnEvent(ItemUpdatedEvent.name)
  async invalidateItem(): Promise<void> {
    await this.cacheInvalidationService.invalidateItem();
  }
}
