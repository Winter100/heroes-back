import { Module } from '@nestjs/common';

import { ItemRepository } from './repository/item.repository';
import { ItemController } from './controller/items.controller';
import { ItemService } from './service/items.service';
import { ItemAdminController } from './controller/items-admin.controller';
import { ItemAdminService } from './service/items-admin.service';
import { ItemCacheHandler } from './event/item-cache.handler';

@Module({
  controllers: [ItemController, ItemAdminController],
  providers: [ItemService, ItemAdminService, ItemRepository, ItemCacheHandler],
  exports: [ItemService, ItemAdminService, ItemRepository],
})
export class ItemsModule {}
