import { Injectable } from '@nestjs/common';
import { EnchantCategory, Prisma } from '@prisma/client';
import { EnchantDropCreateDto } from '../dto/enchant-drop-create.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnchantRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createEnchant(createEnchantDto: Prisma.EnchantCreateInput) {
    return this.prismaService.enchant.create({ data: createEnchantDto });
  }

  updateEnchant(
    enchantId: number,
    updateEnchantDto: Prisma.EnchantUpdateInput,
  ) {
    return this.prismaService.enchant.update({
      where: { id: enchantId },
      data: { ...updateEnchantDto },
    });
  }

  async upsertEnchant(
    enchantId: number,
    upsertEnchantDetailDto: Prisma.EnchantUpdateInput,
  ) {
    return this.prismaService.enchant.update({
      where: { id: enchantId },
      data: { ...upsertEnchantDetailDto },
    });
  }

  deleteEnchant(enchantId: number) {
    return this.prismaService.enchant.delete({ where: { id: enchantId } });
  }

  async findEnchantByName(name: string) {
    return await this.prismaService.enchant.findUnique({
      where: {
        name,
      },
    });
  }
  async findEnchantById(id: number) {
    return await this.prismaService.enchant.findUnique({
      where: {
        id,
      },
      include: {
        effects: true,
      },
    });
  }

  async findAllWithRelations(
    category: EnchantCategory = EnchantCategory.ENCHANT,
  ): Promise<EnchantWithRelations[]> {
    if (category === EnchantCategory.ENCHANT) {
      return await this.prismaService.enchant.findMany({
        where: { category },
        select: enchantWithRelationsSelect,
      });
    }
    return await this.prismaService.infusion.findMany({
      where: { category },
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

const baseRelationsSelect = {
  id: true,
  name: true,
  category: true,
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
      value: true,
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
};

const enchantWithRelationsSelect = Prisma.validator<Prisma.EnchantSelect>()({
  ...baseRelationsSelect,
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
