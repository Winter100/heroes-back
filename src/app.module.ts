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
import { HealthModule } from './health/health.module';
import { NoticeModule } from './notice/notice.module';
import { NexonModule } from './nexon/nexon.module';
import { StatisticsModule } from './statistics/statistics.module';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
import { GlobalExceptionFilter } from './all-exceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { RedisModule } from './redis/redis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        genReqId: (req, res) => {
          const existingId = req.headers['x-request-id'];

          const isValidRequestId =
            typeof existingId === 'string' &&
            existingId.length <= 128 &&
            /^[a-zA-Z0-9._:-]+$/.test(existingId);

          const requestId = isValidRequestId ? existingId : randomUUID();

          res.setHeader('X-Request-Id', requestId);

          return requestId;
        },

        serializers: {
          req: (req: IncomingMessage & { id?: string }) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            ip: req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress,
            userAgent: req.headers['user-agent'],
          }),
          res: (res: ServerResponse) => ({
            statusCode: res.statusCode,
          }),
        },

        /**
         * 로그에 절대 남기면 안 되는 민감 정보
         */
        redact: {
          paths: [
            // Request body
            'req.body.password',
            'req.body.currentPassword',
            'req.body.newPassword',
            'req.body.refreshToken',
            'req.body.accessToken',
            'req.body.token',

            // Authorization
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers["set-cookie"]',

            // 일반적인 token 필드
            'req.body.*.accessToken',
            'req.body.*.refreshToken',
            'req.body.*.password',

            // 혹시 객체 안에 들어가는 토큰
            '*.accessToken',
            '*.refreshToken',
          ],

          censor: '[REDACTED]',
        },

        /**
         * status code에 따른 log level
         */
        customLogLevel: (req, res, err) => {
          if (err || res.statusCode >= 500) {
            return 'error';
          }

          if (res.statusCode >= 400) {
            return 'warn';
          }

          return 'info';
        },

        /**
         * 성공 로그
         */
        customSuccessMessage: (req, res) =>
          `${req.method} ${req.url} completed`,

        /**
         * 개발환경에서만 pretty log
         */
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
    RedisModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
