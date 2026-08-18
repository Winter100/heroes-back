import { Module } from '@nestjs/common';
import { EnchantsController } from './controller/enchants.controller';
import { EnchantService } from './service/enchants.service';
import { EnchantRepository } from './repository/enchant.respository';
import { NexonModule } from 'src/nexon/nexon.module';
import { EnchantsAdminController } from './controller/enchants-admin.controller';
import { EnchantAdminService } from './service/enchants-admin.service';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [NexonModule, ItemsModule],
  controllers: [EnchantsController, EnchantsAdminController],
  providers: [EnchantService, EnchantAdminService, EnchantRepository],
})
export class EnchantsModule {}
