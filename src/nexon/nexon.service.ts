import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NoticeType } from './type/notice-type';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NexonService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getNotice<T>(type: NoticeType): Promise<T> {
    const baseUrl = this.configService.get<string>('NEXON_BASE_URL');
    const apiKey = this.configService.get<string>('NEXON_API_KEY');

    if (!baseUrl || !apiKey)
      throw new InternalServerErrorException('API 설정 정보가 없습니다');

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<T>(`${baseUrl}/${type}`, {
          headers: {
            'x-nxopen-api-key': apiKey,
          },
          timeout: 5000,
        }),
      );

      return data;
    } catch {
      throw new BadGatewayException('Nexon API Error');
    }
  }

  getNoticeValue<T>(notice: PromiseSettledResult<T>) {
    return notice.status === 'fulfilled' ? notice.value : [];
  }
}
