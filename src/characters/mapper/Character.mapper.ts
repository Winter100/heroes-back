import { BattleType, Gender } from '@prisma/client';
import {
  CharacterBasicWithSkill,
  CharacterSkillWithSkill,
} from '../repository/character.repository';

export class CharacterMapper {
  static toCharacterBasicAllResponse(data: CharacterBasicWithSkill[]) {
    return data.map((character) => {
      const { _count, ...rest } = character;
      return {
        ...rest,
        skillCount: _count.characterSkill,
      };
    });
  }

  static toSkillResponse(c: CharacterSkillWithSkill) {
    return {
      id: c.id,
      name: c.name,
      image: c.image,
      gender: c.gender,
      releaseDate: c.releaseDate,
      skillCount: c._count.characterSkill,
      skills: c.characterSkill.map((skill) => skill.skill),
    };
  }

  static toGenderCount(count: { _count: number; gender: Gender | null }[]) {
    return count.map((c) => {
      return {
        count: c._count,
        gender: c.gender,
        fill: c.gender === 'male' ? 'var(--color-male)' : 'var(--color-female)',
      };
    });
  }

  static toYear(
    characters: {
      skillCount: number;
      name: string;
      id: number;
      image: string | null;
      battleType: BattleType | null;
      gender: Gender | null;
      releaseDate: Date | null;
    }[],
  ) {
    const yearCount = new Map<number, number>();

    for (const character of characters) {
      if (!character.releaseDate) continue;

      const year = character.releaseDate.getFullYear();

      yearCount.set(year, (yearCount.get(year) ?? 0) + 1);
    }

    return Array.from(yearCount, ([year, count]) => ({
      year,
      count,
    })).sort((a, b) => a.year - b.year);
  }
}
