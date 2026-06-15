import { Injectable } from '@nestjs/common';
import { EnchantCategory, Prisma } from '@prisma/client';
import { EnchantDropCreateDto } from '../dto/enchant-drop-create.dto';
import { PrismaService } from '../../prisma/prisma.service';

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

// const enchantWithRelationsSelect = Prisma.validator<Prisma.EnchantSelect>()({
//   name: true,
//   category: true,
//   enchantSlot: {
//     select: {
//       slot: {
//         select: {
//           name: true,
//           value: true,
//         },
//       },
//     },
//   },
//   rank: {
//     select: {
//       name: true,
//     },
//   },
//   affix: {
//     select: {
//       name: true,
//     },
//   },
//   effects: {
//     select: {
//       stat: {
//         select: {
//           name: true,
//         },
//       },
//       value: true,
//     },
//   },
//   enchantDrop: {
//     select: {
//       item: {
//         select: {
//           name: true,
//           image: true,
//         },
//       },
//       raid: {
//         select: {
//           battle: true,
//           image: true,
//         },
//       },
//     },
//   },
// });

// const infusionWithRelationsSelect = Prisma.validator<Prisma.InfusionSelect>()({
//   name: true,
//   category: true,
//   enchantSlot: {
//     select: {
//       slot: {
//         select: {
//           name: true,
//           value: true,
//         },
//       },
//     },
//   },
//   rank: {
//     select: {
//       name: true,
//     },
//   },
//   affix: {
//     select: {
//       name: true,
//     },
//   },
//   effects: {
//     select: {
//       stat: {
//         select: {
//           name: true,
//         },
//       },
//       value: true,
//     },
//   },
// });

// 1. 완벽하게 똑같은 공통 구조를 하나의 기본(Base) 객체로 선언합니다.
const baseRelationsSelect = {
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
