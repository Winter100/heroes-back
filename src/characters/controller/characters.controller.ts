import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CharactersService } from '../service/characters.service';

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  // 모든 캐릭터의 기본 정보 및 스킬수
  @Get()
  async findAllCharacter() {
    return await this.charactersService.findAllCharacter();
  }

  // 모든 직업 이미지
  @Get('image')
  async getCharacterImage() {
    return await this.charactersService.getCharacterImage();
  }

  // 직업 관련 통계
  // @Get('statistics')
  // async findStatistics() {
  //   return await this.charactersService.findStatistics();
  // }

  // 해당 직업의 기본 정보와 스킬
  @Get(':classId')
  async findOneDetailClass(@Param('classId', ParseIntPipe) classId: number) {
    return await this.charactersService.findOneDetailClass(classId);
  }

  // 넥슨 랭커에 해당 직업이 몇명씩 존재하는지
}
