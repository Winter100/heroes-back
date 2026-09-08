import { Module } from '@nestjs/common';
import { RaidsController } from './controller/raids.controller';
import { RaidRepository } from './repository/raid.repository';
import { RaidsAdminController } from './controller/raids-admin.controller';
import { RaidService } from './service/raids.service';
import { RaidAdminService } from './service/raids-admin.service';
import { RaidCacheHandler } from './event/raid-cache.handler';

@Module({
  controllers: [RaidsController, RaidsAdminController],
  providers: [RaidService, RaidAdminService, RaidRepository, RaidCacheHandler],
  exports: [RaidService],
})
export class RaidsModule {}
