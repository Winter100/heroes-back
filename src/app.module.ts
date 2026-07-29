import { Module } from '@nestjs/common';
import { RaidsModule } from './raids/raids.module';
import { EnchantsModule } from './enchants/enchants.module';
import { CharactersModule } from './characters/characters.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { PartholnModule } from './partholn/partholn.module';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { NoticeModule } from './notice/notice.module';
import { NexonModule } from './nexon/nexon.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: 60000,
            limit: 5000,
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis(configService.get<string>('UPSTASH_REDIS_URL')!),
        ),
      }),
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
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
