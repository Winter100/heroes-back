import { Module } from '@nestjs/common';
import { EnchantsController } from './enchants.controller';
import { EnchantService } from './enchants.service';
import { EnchantRepository } from './repository/enchant.respository';

@Module({
  imports: [],
  controllers: [EnchantsController],
  providers: [EnchantService, EnchantRepository],
})
export class EnchantsModule {}
