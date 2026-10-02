import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RevalidateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async revalidatePath<T>(tag: string, id?: string) {
    const url = this.configService.get<string>('FRONTEND_REVALIDATE_URL');
    const key = this.configService.get<string>('FRONTEND_REVALIDATE_KEY');

    if (!url) {
      throw new InternalServerErrorException(
        'Frontend URL이 설정되지 않았습니다.',
      );
    }

    if (!key) {
      throw new InternalServerErrorException(
        'Revalidate key가 설정되지 않았습니다.',
      );
    }
    const path = id ? `${tag}/${id}` : tag;

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<T>(`${url}/api/revalidate?tag=/${path}`, null, {
          headers: {
            'revalidate-secret': key,
          },
          timeout: 5000,
        }),
      );

      return data;
    } catch {
      throw new BadGatewayException('Revalidate API Error');
    }
  }
}
