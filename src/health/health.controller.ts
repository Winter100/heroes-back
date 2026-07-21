import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  check() {
    return {
      status: 'ok',
      message: '서버가 정상적으로 동작 중입니다.',
      timestamp: new Date().toISOString(),
    };
  }
}
