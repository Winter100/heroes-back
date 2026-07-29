import { Module } from '@nestjs/common';
import { EnchantsController } from './enchants.controller';
import { EnchantService } from './enchants.service';
import { EnchantRepository } from './repository/enchant.respository';
import { NexonModule } from 'src/nexon/nexon.module';

@Module({
  imports: [NexonModule],
  controllers: [EnchantsController],
  providers: [EnchantService, EnchantRepository],
})
export class EnchantsModule {}
