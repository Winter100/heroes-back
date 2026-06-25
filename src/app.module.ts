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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
