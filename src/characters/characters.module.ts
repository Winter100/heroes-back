import { Module } from '@nestjs/common';
import { CharactersController } from './controller/characters.controller';
import { CharacterRepository } from './repository/character.repository';
import { CharactersService } from './service/characters.service';
import { CharactersAdminService } from './service/characters-adminservice';
import { CharactersAdminController } from './controller/characters-admin.controller';
import { CharacterCacheHandler } from './event/character-cache.handler';

@Module({
  controllers: [CharactersController, CharactersAdminController],
  providers: [
    CharactersService,
    CharactersAdminService,
    CharacterRepository,
    CharacterCacheHandler,
  ],
  exports: [CharactersService],
})
export class CharactersModule {}
