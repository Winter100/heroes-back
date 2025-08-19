import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RaidRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllWithRelations() {
    return await this.prisma.raid.findMany({
      select: raidWithRelationsSelect,
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
