import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnchantRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllWithRelations(): Promise<EnchantWithRelations[]> {
    return await this.prismaService.enchant.findMany({
      select: enchantWithRelationsSelect,
    });
  }
}

const enchantWithRelationsSelect = Prisma.validator<Prisma.EnchantSelect>()({
  name: true,
  enchantSlot: {
    select: {
      slot: {
        select: {
          name: true,
          value: true,
        },
      },
    },
  },
  rank: {
    select: {
      name: true,
    },
  },
  affix: {
    select: {
      name: true,
    },
  },
  effects: {
    select: {
      stat: {
        select: {
          name: true,
        },
      },
      value: true,
    },
  },
});

export type EnchantWithRelations = Prisma.EnchantGetPayload<{
  select: typeof enchantWithRelationsSelect;
}>;
