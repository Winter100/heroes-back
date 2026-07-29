import { Controller, Get } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}
  @Get()
  async findAll() {
    return await this.noticeService.findAll();
  }
}
