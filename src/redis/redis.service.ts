import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redis: Redis;

  constructor(
    @InjectPinoLogger(RedisService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('REDIS_URL');

    if (!url) {
      throw new Error('REDIS_URL is not defined');
    }

    this.redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 5000, 60000);
        this.logger.warn(
          { attempt: times, delayMs: delay },
          'Redis retry scheduled',
        );
        return delay;
      },
    });

    this.redis.on('error', (error: Error) => {
      this.logger.error({ err: error }, 'redis connection error');
    });

    this.redis.on('ready', () => {
      this.logger.info('redis connection ready');
    });

    this.redis.on('reconnecting', (delay: number) => {
      this.logger.warn({ delay }, 'redis reconnecting');
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.redis.ping();

      this.logger.info('redis connected');
    } catch (error: unknown) {
      this.logger.warn(
        { err: error },
        'redis connection failed during startup',
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
    this.logger.info('Redis connection closed');
  }

  async getOrSet<T>(key: string, ttl: number, fetchFn: () => Promise<T>) {
    try {
      const cached = await this.redis.get(key);
      if (cached !== null && cached !== undefined) {
        this.logger.debug({ key }, 'redis cache hit');
        return JSON.parse(cached) as T;
      }
    } catch (err: unknown) {
      this.logger.error({ err, key }, 'redis cache get failed');
    }

    this.logger.debug({ key }, 'redis cache miss');
    const data = await fetchFn();

    try {
      const serialized = JSON.stringify(data);
      await this.redis.set(key, serialized, 'EX', ttl);
      this.logger.debug({ key }, 'redis cache set');
    } catch (err: unknown) {
      this.logger.error({ err, key }, 'redis cache set failed');
    }
    return data;
  }

  async del(key: string | string[]): Promise<void> {
    try {
      await this.redis.del(...key);
      this.logger.debug({ key }, 'Redis cache deleted');
    } catch (err: unknown) {
      this.logger.error({ err, key }, 'Redis cache delete failed');
    }
  }
}
