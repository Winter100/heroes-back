import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @InjectPinoLogger(PrismaService.name)
    private readonly logger: PinoLogger,
  ) {
    super();
  }
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.info(
        { event: 'Prisma db.connected' },
        'Prisma Database connection established',
      );
    } catch (error: unknown) {
      this.logger.error({ error }, 'Prisma Database connection failed');
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.info(
      { event: 'Prisma db.disconnected' },
      'Prisma Database connection closed',
    );
  }
}
