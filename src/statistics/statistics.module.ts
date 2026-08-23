import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { CharactersModule } from 'src/characters/characters.module';
import { EnchantsModule } from 'src/enchants/enchants.module';
import { RaidsModule } from 'src/raids/raids.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [CharactersModule, EnchantsModule, RaidsModule, ItemsModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
