import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CharacterRepository } from './repository/character.repository';

@Module({
  imports: [SupabaseModule, PrismaModule],
  controllers: [CharactersController],
  providers: [CharactersService, CharacterRepository],
})
export class CharactersModule {}
