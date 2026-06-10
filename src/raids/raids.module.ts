import { Module } from '@nestjs/common';
import { RaidService } from './raids.service';
import { RaidsController } from './raids.controller';
import { RaidRepository } from './repository/raid.repository';

@Module({
  imports: [],
  controllers: [RaidsController],
  providers: [RaidService, RaidRepository],
})
export class RaidsModule {}
