import { Injectable } from '@nestjs/common';

import {
  NoticeDataType,
  NoticeEventDataType,
  NoticePatchDataType,
} from '../nexon/type/notice-type';
import { NexonService } from 'src/nexon/nexon.service';

@Injectable()
export class NoticeService {
  constructor(private readonly nexonService: NexonService) {}

  async findAll() {
    const [noticeResult, eventNoticeResult, patchNoticeResult] =
      await Promise.allSettled([
        this.nexonService.getNotice<NoticeDataType>('notice'),
        this.nexonService.getNotice<NoticeEventDataType>('notice-event'),
        this.nexonService.getNotice<NoticePatchDataType>('notice-patch'),
      ]);

    return {
      notice: this.nexonService.getNoticeValue(noticeResult),
      eventNotice: this.nexonService.getNoticeValue(eventNoticeResult),
      patchNotice: this.nexonService.getNoticeValue(patchNoticeResult),
    };
  }
}
