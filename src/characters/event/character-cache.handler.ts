import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CacheInvalidationService } from 'src/redis/cache-invalidation.service';
import { CharacterUpdatedEvent } from './character-updated.event';

@Injectable()
export class CharacterCacheHandler {
  constructor(
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  @OnEvent(CharacterUpdatedEvent.name)
  async invalidateCharacter(): Promise<void> {
    await this.cacheInvalidationService.invalidateCharacter();
  }
}
