import { Module } from '@nestjs/common';
import { RaidService } from './raids.service';
import { RaidsController } from './raids.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RaidRepository } from './repository/raid.repository';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [RaidsController],
  providers: [RaidService, RaidRepository],
})
export class RaidsModule {}
