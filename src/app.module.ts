import { Module } from '@nestjs/common';
import { RaidsModule } from './raids/raids.module';
import { EnchantsModule } from './enchants/enchants.module';
import { CharactersModule } from './characters/characters.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { PartholnModule } from './partholn/partholn.module';
// import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
// import Redis from 'ioredis';
// import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { NoticeModule } from './notice/notice.module';
import { NexonModule } from './nexon/nexon.module';
// import { APP_GUARD } from '@nestjs/core';
import { StatisticsModule } from './statistics/statistics.module';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
import { GlobalExceptionFilter } from './all-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        genReqId: (req, res) => {
          const existingId = req.headers['x-request-id'];

          const id =
            typeof existingId === 'string' && existingId.length > 0
              ? existingId
              : randomUUID();

          res.setHeader('X-Request-Id', id);

          return id;
        },

        serializers: {
          req: (req: IncomingMessage & { id?: string }) => ({
            reqId: req.id,
            method: req.method,
            url: req.url,
          }),
          res: (res: ServerResponse) => ({
            statusCode: res.statusCode,
          }),
        },
        redact: {
          paths: [
            'req.body.password',
            'req.body.refreshToken',
            '*.accessToken',
            '*.refreshToken',
          ],
          censor: '**REDACTED**',
        },

        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },

        customSuccessMessage: (req, res) =>
          `${req.method} ${req.url} completed`,

        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                },
              }
            : undefined,

        autoLogging: {
          ignore: (req) => {
            const ignoredPaths = ['/favicon.ico', '/health', '/robots.txt'];

            return ignoredPaths.includes(req.url ?? '');
          },
        },
      },
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     throttlers: [
    //       {
    //         ttl: 60000,
    //         limit: 5000,
    //       },
    //     ],
    //     storage: new ThrottlerStorageRedisService(
    //       new Redis(configService.get<string>('UPSTASH_REDIS_URL')!),
    //     ),
    //   }),
    // }),
    PrismaModule,
    SupabaseModule,
    RaidsModule,
    EnchantsModule,
    CharactersModule,
    AuthModule,
    UsersModule,
    ItemsModule,
    PartholnModule,
    HealthModule,
    NoticeModule,
    NexonModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
