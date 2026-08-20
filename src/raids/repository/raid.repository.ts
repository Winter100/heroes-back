import { UpdateRaidDto } from './../dto/raid-update.dto';
import { RaidCreateDto } from './../dto/raid-create.dto';
import { Injectable } from '@nestjs/common';
import { Prisma, RaidTitle } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RaidRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllRaidTitles() {
    return this.prisma.raidTitle.findMany();
  }

  async findAllWithRelations() {
    return await this.prisma.raid.findMany({
      select: raidWithRelationsSelect,
      orderBy: [{ raidTitle: { id: 'asc' } }, { id: 'asc' }],
    });
  }

  async findRaidTitle(raidTitle: string) {
    return await this.prisma.raidTitle.findUnique({
      where: {
        name: raidTitle,
      },
    });
  }

  async findRaidById(raidId: number) {
    return await this.prisma.raid.findUnique({
      where: {
        id: raidId,
      },
      select: raidWithRelationsSelect,
    });
  }

  upsertRaidDetil(raidId: number, data: Prisma.RaidUpdateInput) {
    return this.prisma.raid.update({ where: { id: raidId }, data });
  }

  updateRaid(raidId: number, updateRaidDto: UpdateRaidDto, image?: string) {
    return this.prisma.raid.update({
      where: { id: raidId },
      data: {
        raidTitleId: updateRaidDto.raidId,
        battle: updateRaidDto.battle,
        boss: updateRaidDto.boss,
        level: updateRaidDto.level,
        image,
      },
    });
  }

  async createRaid(raidCreateDto: RaidCreateDto, image?: string) {
    return await this.prisma.raid.create({
      data: {
        raidTitleId: raidCreateDto.raidId,
        battle: raidCreateDto.battle,
        boss: raidCreateDto.boss,
        level: raidCreateDto.level,
        image,
      },
    });
  }

  delete(raidId: number) {
    return this.prisma.raid.delete({ where: { id: raidId } });
  }

  async createRaidTitle(raidTitle: string): Promise<RaidTitle> {
    return await this.prisma.raidTitle.upsert({
      where: {
        name: raidTitle,
      },
      update: {},
      create: {
        name: raidTitle,
      },
    });
  }
}

const raidWithRelationsSelect = Prisma.validator<Prisma.RaidSelect>()({
  id: true,
  battle: true,
  boss: true,
  image: true,
  level: true,
  raidTitle: true,
  bossStat: {
    select: {
      stat: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      value: true,
      type: true,
    },
  },
  bonusTargets: {
    select: {
      bonus: true,
      value: true,
    },
  },
  basicClearReward: {
    select: {
      basicClearRewardName: {
        select: {
          name: true,
        },
      },
      value: true,
    },
  },
});

export type RaidWithRelations = Prisma.RaidGetPayload<{
  select: typeof raidWithRelationsSelect;
}>;
