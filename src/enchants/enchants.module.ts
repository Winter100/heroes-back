import { Module } from '@nestjs/common';
import { EnchantsController } from './enchants.controller';
import { EnchantService } from './enchants.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EnchantRepository } from './repository/enchant.respository';

@Module({
  imports: [PrismaModule],
  controllers: [EnchantsController],
  providers: [EnchantService, EnchantRepository],
})
export class EnchantsModule {}
