export type NoticeDataType = {
  notice: {
    title: string;
    url: string;
    notice_id: number;
    date: string;
  }[];
};
export type NoticePatchDataType = {
  patch_notice: {
    title: string;
    url: string;
    notice_id: number;
    date: string;
  }[];
};

export type NoticeEventDataType = {
  event_notice: {
    title: string;
    url: string;
    notice_id: 0;
    date_event_start: string;
    date_event_end: string;
    ongoing_flag: string;
  }[];
};

export type NoticeType = 'notice' | 'notice-patch' | 'notice-event';
