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
        name: true,
        image: true,
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
}
