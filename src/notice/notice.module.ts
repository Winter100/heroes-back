import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { NexonModule } from 'src/nexon/nexon.module';

@Module({
  imports: [NexonModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export class NoticeModule {}
