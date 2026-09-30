import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class RedisService implements OnModuleDestroy {
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
      enableOfflineQueue: false,
      connectTimeout: 10000,
      commandTimeout: 3000,
      maxRetriesPerRequest: 1,
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

  onModuleDestroy(): void {
    this.redis.disconnect();
    this.logger.info('Redis connection closed');
  }

  async getOrSet<T>(
    key: string,
    ttl: number,
    fetchFn: () => Promise<T>,
  ): Promise<T> {
    if (this.redis.status !== 'ready') {
      this.logger.warn(
        { key, status: this.redis.status },
        'redis unavailable; querying DB',
      );
      return fetchFn();
    }

    try {
      const cached = await this.redis.get(key);
      if (cached !== null) {
        this.logger.debug({ key }, 'redis cache hit');
        return JSON.parse(cached) as T;
      }
    } catch (err: unknown) {
      this.logger.warn({ err, key }, 'redis cache get failed; querying DB');
      return fetchFn();
    }

    this.logger.debug({ key }, 'redis cache miss');
    const data = await fetchFn();

    if (this.redis.status !== 'ready') return data;

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
