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
      skills: c.characterSkill.map((skill) => skill.skill),
    };
  }
}
