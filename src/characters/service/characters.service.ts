import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CharacterRepository } from '../repository/character.repository';
import { CharacterMapper } from '../mapper/Character.mapper';

@Injectable()
export class CharactersService {
  constructor(private readonly characterRepository: CharacterRepository) {}

  async findAllCharacter() {
    const characters = await this.characterRepository.findAllCharacter();
    if (!characters) throw new NotFoundException(`캐릭터 정보가 없습니다.`);

    return CharacterMapper.toCharacterBasicAllResponse(characters);
  }

  async getCharacterImage() {
    const characters = await this.characterRepository.getCharacterImage();

    if (!characters) throw new NotFoundException(`캐릭터 정보가 없습니다.`);

    return characters;
  }

  async findOneDetailClass(classId: number) {
    if (!classId) throw new BadRequestException('직업 아이디를 확인해주세요.');

    const charater = await this.characterRepository.findOneDetailClass(classId);

    if (!charater) throw new NotFoundException(`${classId} 정보가 없습니다.`);

    return CharacterMapper.toSkillResponse(charater);
  }

  /**
   * 통계
   *
   * @returns 1. 성별
   *
   */
  async findStatistics() {
    const [characters, count] = await Promise.all([
      this.findAllCharacter(),
      this.countGender(),
    ]);

    const year = CharacterMapper.toYear(characters);
    const genderCount = CharacterMapper.toGenderCount(count);
    return { year, genderCount };
  }

  async countGender() {
    const count = await this.characterRepository.countGender();
    if (!count) throw new NotFoundException(`카운트 정보가 없습니다.`);
    return count;
  }
}
