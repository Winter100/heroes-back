import { RaidCreateDto } from './../dto/raid-create.dto';
import { Injectable } from '@nestjs/common';
import { Prisma, Raid, RaidTitle } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RaidRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithRelations() {
    return await this.prisma.raid.findMany({
      select: raidWithRelationsSelect,
    });
  }

  async findRaidTitle(raidTitle: string) {
    return await this.prisma.raidTitle.findUnique({
      where: {
        name: raidTitle,
      },
    });
  }

  async updateBattleImage(battle: string, imgaeUrl: string) {
    return await this.prisma.raid.update({
      where: { battle: battle },
      data: {
        image: imgaeUrl,
      },
    });
  }

  async createRaid(
    raidTitleId: number,
    raidCreateDto: RaidCreateDto,
    image: string,
  ): Promise<Raid> {
    return await this.prisma.raid.create({
      data: {
        raidTitleId,
        battle: raidCreateDto.battle,
        boss: raidCreateDto.boss,
        level: raidCreateDto.level,
        image,
      },
    });
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
  raidTitle: {
    select: {
      name: true,
    },
  },
  bossStat: {
    select: {
      stat: {
        select: {
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
