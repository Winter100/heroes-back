import { Module } from '@nestjs/common';
import { RaidsController } from './controller/raids.controller';
import { RaidRepository } from './repository/raid.repository';
import { RaidsAdminController } from './controller/raids-admin.controller';
import { RaidService } from './service/raids.service';
import { RaidAdminService } from './service/raids-admin.service';

@Module({
  imports: [],
  controllers: [RaidsController, RaidsAdminController],
  providers: [RaidService, RaidAdminService, RaidRepository],
})
export class RaidsModule {}
