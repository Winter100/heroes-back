import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RevalidateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async revalidatePath<T>(path: string) {
    const url = this.configService.get<string>('FRONTEND_URL');
    const key = this.configService.get<string>('FRONTEND_REVALIDATE_KEY');

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<T>(`${url}/${path}`, {
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
