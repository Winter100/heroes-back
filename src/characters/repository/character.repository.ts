import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

interface UCharacterRepository {
  findSkillsByClassName(jobName: string): unknown;
  createClassProfile(jobName: string, image: string): unknown;
}

@Injectable()
export class CharacterRepository implements UCharacterRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findSkillsByClassName(jobName: string) {
    return await this.prismaService.character.findUnique({
      where: { name: jobName },
      select: {
        characterSkill: {
          select: {
            skill: {
              select: {
                name: true,
                description: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  async createClassProfile(jobName: string, image: string) {
    return await this.prismaService.character.create({
      data: {
        name: jobName,
        image,
      },
    });
  }

  async createSkill(skillName: string, description: string, image: string) {
    return await this.prismaService.skill.create({
      data: {
        name: skillName,
        image,
        description,
      },
    });
  }

  async createClassSkill(className: string, skillId: number) {
    await this.prismaService.characterSkill.create({
      data: {
        character: {
          connect: {
            name: className,
          },
        },
        skill: {
          connect: { id: skillId },
        },
      },
    });
  }
}
