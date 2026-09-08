import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CharacterRepository } from '../repository/character.repository';
import { CharacterMapper } from '../mapper/Character.mapper';
import { RedisService } from 'src/redis/redis.service';
import { RedisKeys } from 'src/redis/redis-keys.constant';

@Injectable()
export class CharactersService {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 모든 캐릭터 정보
   * @returns
   */
  async findAllCharacter() {
    return this.redisService.getOrSet(
      RedisKeys.characterList(),
      60 * 60,
      async () => {
        const characters = await this.characterRepository.findAllCharacter();
        if (!characters) throw new NotFoundException(`캐릭터 정보가 없습니다.`);
        return CharacterMapper.toCharacterBasicAllResponse(characters);
      },
    );
  }

  /**
   * 모든 캐릭터 이미지
   * @returns
   */
  async getCharacterImage() {
    const characters = await this.characterRepository.getCharacterImage();

    if (!characters) throw new NotFoundException(`캐릭터 정보가 없습니다.`);

    return characters;
  }

  /**
   * 특정 직업 상세 정보
   * @param classId
   * @returns
   */
  async findOneDetailClass(classId: number) {
    if (!classId) throw new BadRequestException('직업 아이디를 확인해주세요.');

    const charater = await this.characterRepository.findOneDetailClass(classId);

    if (!charater) throw new NotFoundException(`${classId} 정보가 없습니다.`);

    return CharacterMapper.toSkillResponse(charater);
  }

  /**
   * 통계
   * @returns
   * 1. 등록된 직업수
   * 2. 성별 수
   * 3. 연도별 출시 캐릭터 수
   */
  findStatistics() {
    return this.redisService.getOrSet(
      RedisKeys.characterStatistics(),
      60 * 60,
      async () => {
        const [total, characters, genderCount] = await Promise.all([
          this.characterRepository.count(),
          this.findAllCharacter(),
          this.countGender(),
        ]);

        const year = CharacterMapper.toYear(characters);
        const gCount = CharacterMapper.toGenderCount(genderCount);

        return { total, year, genderCount: gCount };
      },
    );
  }

  /**
   * 성별 카운트 [헬퍼]
   * @returns
   */
  async countGender() {
    const count = await this.characterRepository.countGender();
    if (!count) throw new NotFoundException(`카운트 정보가 없습니다.`);
    return count;
  }
}
