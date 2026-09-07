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

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);

      if (value === null) {
        this.logger.debug({ key }, 'redis cache miss');
        return null;
      }

      this.logger.debug({ key }, 'redis cache hit');

      return JSON.parse(value) as T;
    } catch (err: unknown) {
      this.logger.error({ err, key }, 'redis cache get failed');

      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);

      if (ttl) {
        await this.redis.set(key, serialized, 'EX', ttl);
      } else {
        await this.redis.set(key, serialized);
      }

      this.logger.debug({ key }, 'redis cache set');
    } catch (err: unknown) {
      this.logger.error({ err, key }, 'redis cache set failed');
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      this.logger.debug({ key }, 'Redis cache deleted');
    } catch (err: unknown) {
      this.logger.error({ err, key }, 'Redis cache delete failed');
    }
  }
}
