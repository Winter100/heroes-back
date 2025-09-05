import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnchantDropCreateDto } from '../dto/enchant-drop-create.dto';

@Injectable()
export class EnchantRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findEnchant(name: string) {
    return await this.prismaService.enchant.findUnique({
      where: {
        name,
      },
    });
  }

  async findAllWithRelations(): Promise<EnchantWithRelations[]> {
    return await this.prismaService.enchant.findMany({
      select: enchantWithRelationsSelect,
    });
  }

  async updateEnchantDrop(enchantDropCreateDto: EnchantDropCreateDto) {
    const { enchantName, battleName, itemName } = enchantDropCreateDto;
    await this.prismaService.enchantDrop.create({
      data: {
        enchant: {
          connect: {
            name: enchantName,
          },
        },
        ...(battleName && {
          raid: {
            connect: {
              battle: battleName,
            },
          },
        }),
        ...(itemName && {
          item: {
            connect: {
              name: itemName,
            },
          },
        }),
      },
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
  enchantDrop: {
    select: {
      item: {
        select: {
          name: true,
          image: true,
        },
      },
      raid: {
        select: {
          battle: true,
          image: true,
        },
      },
    },
  },
});

export type EnchantWithRelations = Prisma.EnchantGetPayload<{
  select: typeof enchantWithRelationsSelect;
}>;
