import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NoticeType } from './type/notice-type';
import { firstValueFrom } from 'rxjs';
import { ItemPriceApiType } from 'src/enchants/type/price-type';
import { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';

@Injectable()
export class NexonService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getEnchantPrice(itemName: string = '인챈트 스크롤') {
    const { v2Url, apiKey } = this.getBaseUrlAndKey();
    const allData: ItemPriceApiType[] = [];
    let nextCursor: string | null = null;

    try {
      do {
        const type = nextCursor
          ? `marketplace/market-history?item_name=${itemName}&cursor=${nextCursor}`
          : `marketplace/market-history?item_name=${itemName}`;

        const response: AxiosResponse<ItemPriceApiType> = await firstValueFrom(
          this.httpService.get<ItemPriceApiType>(`${v2Url}/${type}`, {
            headers: {
              'x-nxopen-api-key': apiKey,
            },
            timeout: 5000,
          }),
        );
        const data = response.data;

        allData.push(data);
        nextCursor = data.next_cursor;

        if (nextCursor) await delay(300);
      } while (nextCursor);

      return allData;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('status:', error.response?.status);
        console.log('data:', error.response?.data);
      }

      throw new BadGatewayException('Nexon API Error');
    }
  }

  async getNotice<T>(type: NoticeType): Promise<T> {
    const { v1Url, apiKey } = this.getBaseUrlAndKey();

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<T>(`${v1Url}/${type}`, {
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

  getBaseUrlAndKey() {
    const v1Url = this.configService.get<string>('NEXON_BASE_URL');
    const v2Url = this.configService.get<string>('NEXON_BASE_URL_V2');
    const apiKey = this.configService.get<string>('NEXON_API_KEY');

    if (!v1Url)
      throw new InternalServerErrorException('v1 Url 정보가 없습니다');
    if (!v2Url)
      throw new InternalServerErrorException('v2 Url 정보가 없습니다');
    if (!apiKey)
      throw new InternalServerErrorException('API Key 정보가 없습니다');

    return { v1Url, v2Url, apiKey };
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
