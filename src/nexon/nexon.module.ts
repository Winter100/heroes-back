import { Module } from '@nestjs/common';
import { NexonService } from './nexon.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [NexonService],
  exports: [NexonService],
})
export class NexonModule {}
