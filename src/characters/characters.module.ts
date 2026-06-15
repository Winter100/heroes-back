import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { CharacterRepository } from './repository/character.repository';

@Module({
  imports: [],
  controllers: [CharactersController],
  providers: [CharactersService, CharacterRepository],
})
export class CharactersModule {}
