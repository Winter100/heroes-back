import { Module } from '@nestjs/common';
import { ItemController } from './items.controller';
import { ItemService } from './items.service';
import { ItemRepository } from './repository/item.repository';

@Module({
  controllers: [ItemController],
  providers: [ItemService, ItemRepository],
})
export class ItemsModule {}
