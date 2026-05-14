import { Module } from '@nestjs/common';
import { PartholnService } from './partholn.service';
import { PartholnController } from './partholn.controller';
import { PartholnRepository } from './repository/partholn.repository';

@Module({
  controllers: [PartholnController],
  providers: [PartholnService, PartholnRepository],
})
export class PartholnModule {}
