import { UpdateSkillDto } from './../dto/update-skill.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateClassDto } from '../dto/character-class-create.dto';
import { UpdateClassDto } from '../dto/character-class-update.dto';
import { Prisma } from '@prisma/client';
import { CreateSkillDto } from '../dto/create-skill.dto';

@Injectable()
export class CharacterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * 아이디로 직업 정보 찾기
   * @param id
   * @returns 1. 직업 이름, 2. 직업 이미지
   */
  async findOneClass(id: number) {
    return await this.prismaService.character.findUnique({
      where: { id },
    });
  }

  /**
   * 이름으로 직업 정보 찾기
   * @param name
   * @returns 1. 직업 이름, 2. 직업 이미지
   */
  async findOneClassByName(name: string) {
    return await this.prismaService.character.findUnique({
      where: { name },
    });
  }

  /**
   * 모든 직업 정보 배열
   * @returns 1. 직업 이름, 2. 직업 이미지, 3. 스킬수
   */
  async findAllCharacter() {
    return await this.prismaService.character.findMany({
      include: includeCharacter,
    });
  }

  /**
   * 직업 정보와 갖고 있는 스킬
   * @param classId
   * @returns 1. 직업 이름, 2. 직업 이미지 3. 갖고 있는 스킬
   */
  async findOneDetailClass(classId: number) {
    return await this.prismaService.character.findUnique({
      where: { id: classId },
      select: selectDetailCharacter,
    });
  }

  /**
   * 직업 생성
   * @param createClassDto
   * @param image
   * @returns
   */
  async createClassProfile(createClassDto: CreateClassDto, image?: string) {
    return await this.prismaService.character.create({
      data: {
        ...createClassDto,
        image,
      },
    });
  }

  /**
   * 직업 수정
   * @param updateDto
   * @param classId
   * @param image
   * @returns
   */
  async updateClassProfile(
    updateDto: UpdateClassDto,
    classId: number,
    image?: string,
  ) {
    return await this.prismaService.character.update({
      where: { id: classId },
      data: { ...updateDto, image },
    });
  }

  /**
   * 직업 삭제
   * @param classId
   * @returns
   */
  async deleteClassProfile(classId: number) {
    return await this.prismaService.character.delete({
      where: { id: classId },
    });
  }

  /**
   * 트랜잭션
   * 1. 스킬 생성
   * 2. 생성된 스킬과 직업 연결
   * @param createSkillDto
   * @param image
   * @returns
   */
  async createSkillCombineClassId(
    createSkillDto: CreateSkillDto,
    image?: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const skill = await tx.skill.create({
        data: {
          name: createSkillDto.name,
          description: createSkillDto.description,
          image,
        },
      });

      return await tx.characterSkill.createMany({
        data: createSkillDto.classIds.map((id) => ({
          characterId: id,
          skillId: skill.id,
        })),
      });
    });
  }

  /**
   * 트랜잭션
   * 1. 직업스킬에서 스킬아이디를 갖는 데이터 모두 삭제
   * 2. 직업스킬에서 받은 직업아이디와 스킬아이디를 다시 생성
   * @param updateSkillDto
   * @param skillId
   * @param image
   * @returns
   */
  async updateSkillCombineClassId(
    updateSkillDto: UpdateSkillDto,
    skillId: number,
    image?: string,
  ) {
    return await this.prismaService.$transaction(async (tx) => {
      const skill = await tx.skill.update({
        where: { id: skillId },
        data: {
          name: updateSkillDto.name,
          description: updateSkillDto.description,
          image,
        },
      });

      await tx.characterSkill.deleteMany({ where: { skillId: skill.id } });
      await tx.characterSkill.createMany({
        data: updateSkillDto.classIds.map((id) => ({
          characterId: id,
          skillId: skill.id,
        })),
      });
    });
  }

  /**
   * 스킬 1개만 수정
   * @param updateSkillDto
   * @param skillId
   * @param image
   * @returns
   */
  async updateOneSkill(
    updateSkillDto: UpdateSkillDto,
    skillId: number,
    image?: string,
  ) {
    return await this.prismaService.skill.update({
      where: {
        id: skillId,
      },
      data: {
        name: updateSkillDto.name,
        description: updateSkillDto.description,
        image,
      },
    });
  }

  /**
   * characterSkill 테이블에서 row 삭제
   * @param id
   * @returns
   */
  async disconnectClassSkill(id: number) {
    return await this.prismaService.characterSkill.delete({
      where: {
        id,
      },
    });
  }

  /**
   * 캐릭터 스킬 테이블에서 row 찾기
   * @param findConnectClassSkill
   * @returns
   */
  async findConnectClassSkill(classId: number, skillId: number) {
    return await this.prismaService.characterSkill.findFirst({
      where: {
        characterId: classId,
        skillId: skillId,
      },
    });
  }

  /**
   * 스킬 이름으로 찾기
   * @param skillName
   * @returns
   */
  async findOneSkillByName(skillName: string) {
    return await this.prismaService.skill.findUnique({
      where: { name: skillName },
    });
  }

  /**
   * 스킬 아이디로 찾기
   * @param skillName
   * @returns
   */
  async findOneSkillById(skillId: number) {
    return await this.prismaService.skill.findUnique({
      where: { id: skillId },
    });
  }

  /**
   * 직업 이름과 이미지
   * @returns
   */
  async getCharacterImage() {
    return await this.prismaService.character.findMany({
      select: {
        name: true,
        image: true,
      },
    });
  }

  async count() {
    return await this.prismaService.character.count();
  }

  async countGender() {
    return await this.prismaService.character.groupBy({
      by: ['gender'],
      _count: true,
    });
  }
}

export const includeCharacter = Prisma.validator<Prisma.CharacterInclude>()({
  _count: {
    select: {
      characterSkill: true,
    },
  },
});

export type CharacterBasicWithSkill = Prisma.CharacterGetPayload<{
  include: typeof includeCharacter;
}>;

const selectDetailCharacter = Prisma.validator<Prisma.CharacterSelect>()({
  id: true,
  name: true,
  image: true,
  gender: true,
  releaseDate: true,
  _count: {
    select: {
      characterSkill: true,
    },
  },
  characterSkill: {
    select: {
      skill: {
        select: {
          id: true,
          name: true,
          image: true,
          description: true,
        },
      },
    },
  },
});

export type CharacterSkillWithSkill = Prisma.CharacterGetPayload<{
  select: typeof selectDetailCharacter;
}>;
