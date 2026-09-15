import { Module } from '@nestjs/common';
import { RevalidateService } from './revalidate.service';
import { RevalidateController } from './revalidate.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [RevalidateController],
  providers: [RevalidateService],
})
export class RevalidateModule {}
