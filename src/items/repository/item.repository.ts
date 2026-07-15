import { Prisma } from '@prisma/client';
import { CreateItemDto } from '../dto/item-create.dto';
import { UpdateItemDto } from '../dto/item-update.dto';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto, image: string) {
    return await this.prismaService.item.create({
      data: {
        name: createItemDto.name,
        description: createItemDto.description,
        image,
        category: {
          connect: {
            name: createItemDto.category,
          },
        },
        tier: {
          connect: {
            name: createItemDto.tier,
          },
        },
      },
    });
  }

  async update(updateItemDto: UpdateItemDto, image: string) {
    return await this.prismaService.item.update({
      where: {
        name: updateItemDto.name,
      },
      data: {
        name: updateItemDto.name,
        description: updateItemDto.description
          ? updateItemDto.description
          : undefined,
        image: image ? image : undefined,
        category: updateItemDto.category
          ? {
              connect: {
                name: updateItemDto.category,
              },
            }
          : undefined,

        tier: updateItemDto.tier
          ? {
              connect: {
                name: updateItemDto.tier,
              },
            }
          : undefined,
      },
    });
  }

  async findItem(name: string) {
    return await this.prismaService.item.findFirst({
      where: {
        name,
      },
      include: {
        category: true,
        tier: true,
      },
    });
  }

  async findCategoryId(category?: string) {
    return await this.prismaService.category.findFirst({
      where: { name: category },
    });
  }
  async findTierId(tier?: string) {
    return await this.prismaService.itemTier.findFirst({
      where: { name: tier },
    });
  }

  async findItemsByCategory(category: string) {
    return await this.prismaService.item.findMany({
      where: {
        category: {
          name: category,
        },
      },
      include: {
        category: true,
        tier: true,
      },
    });
  }

  async findGrindInfo() {
    return await this.prismaService.grind.findMany({
      select: grindWithRelationsSelect,
    });
  }

  async findItemSetOption() {
    return await this.prismaService.itemSet.findMany({
      select: itemSetOptionWithRelationsSelect,
    });
  }

  async getItemRecipe() {
    return await this.prismaService.equipmentStep.findMany({
      where: itemRecipeFilter,
      select: itemRecipeWithRelationsSelect,
    });
  }

  async getUnImageItemsList() {
    return await this.prismaService.item.findMany({
      where: {
        image: null,
      },
      select: {
        name: true,
      },
    });
  }
}

export const grindWithRelationsSelect = Prisma.validator<Prisma.GrindSelect>()({
  id: true,
  title: {
    select: {
      name: true,
    },
  },
  stat: {
    select: {
      name: true,
    },
  },
  statOneValue: true,
  statMaxValue: true,
  grindIngredient: {
    select: {
      id: true,
      item: {
        select: {
          name: true,
          image: true,
        },
      },
      quantity: true,
    },
  },
  grindSlot: {
    select: {
      slot: true,
    },
  },
});

export type GrindWithRelations = Prisma.GrindGetPayload<{
  select: typeof grindWithRelationsSelect;
}>;

export const itemSetOptionWithRelationsSelect =
  Prisma.validator<Prisma.ItemSetSelect>()({
    name: true,
    itemSetSlotList: {
      select: {
        slot: true,
      },
    },
    itemSetList: {
      select: {
        item: {
          select: {
            name: true,
          },
        },
      },
    },
    itemSetBonus: {
      select: {
        level: {
          select: {
            level: true,
          },
        },
        stat: {
          select: {
            name: true,
            image: true,
          },
        },
        statValue: true,
      },
    },
  });

export type ItemSetWithRelations = Prisma.ItemSetGetPayload<{
  select: typeof itemSetOptionWithRelationsSelect;
}>;

// 레시피 수정하기.
const itemRecipeFilter: Prisma.EquipmentStepWhereInput = {
  recipesAsResult: {
    some: {},
  },
};
export const itemRecipeWithRelationsSelect =
  Prisma.validator<Prisma.EquipmentStepSelect>()({
    stepName: true,
    stats: {
      select: {
        stat: {
          select: {
            name: true,
          },
        },
        value: true,
      },
    },
    item: {
      select: {
        name: true,
        image: true,
        description: true,
        category: {
          select: {
            name: true,
          },
        },
        tier: {
          select: {
            name: true,
          },
        },
        slot: true,
        itemSetList: {
          select: {
            item: {
              select: {
                name: true, // 아이템이 갖게되는 대표 타이틀 1개 ("밀레시안 무기", "오르나 무기" 등등)
              },
            },
            setId: true,
            set: {
              select: {
                id: true,
                name: true,
                itemSetList: {
                  select: {
                    item: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                itemSetSlotList: {
                  select: {
                    slot: {
                      select: {
                        name: true,
                        value: true,
                      },
                    },
                  },
                },
                itemSetBonus: {
                  select: {
                    level: true,
                    stat: {
                      select: {
                        name: true,
                      },
                    },
                    statValue: true,
                  },
                },
              },
            },
          },
        },
        itemGrind: {
          select: {
            grind: {
              select: {
                title: {
                  select: {
                    name: true,
                  },
                },
                grindSlot: {
                  select: {
                    slot: true,
                  },
                },
                stat: {
                  select: {
                    name: true,
                  },
                },
                statOneValue: true,
                statMaxValue: true,
                grindIngredient: {
                  select: {
                    quantity: true,
                    item: {
                      select: {
                        name: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    recipesAsResult: {
      select: {
        quantity: true,
        description: true,
        materialStep: {
          select: {
            stepName: true,
            stats: {
              select: {
                stat: {
                  select: {
                    name: true,
                  },
                },
                value: true,
              },
            },
            item: {
              select: {
                name: true,
                image: true,
                description: true,
                category: {
                  select: {
                    name: true,
                  },
                },
                tier: {
                  select: {
                    name: true,
                  },
                },
                slot: true,
                itemSetList: {
                  select: {
                    item: {
                      select: {
                        name: true,
                      },
                    },
                    set: {
                      select: {
                        id: true,
                        name: true,
                        itemSetList: {
                          select: {
                            item: {
                              select: {
                                name: true,
                              },
                            },
                          },
                        },
                        itemSetSlotList: {
                          select: {
                            slot: {
                              select: {
                                name: true,
                                value: true,
                              },
                            },
                          },
                        },
                        itemSetBonus: {
                          select: {
                            level: true,
                            stat: {
                              select: {
                                name: true,
                              },
                            },
                            statValue: true,
                          },
                        },
                      },
                    },
                  },
                },
                itemGrind: {
                  select: {
                    grind: {
                      select: {
                        title: {
                          select: {
                            name: true,
                          },
                        },
                        grindSlot: {
                          select: {
                            slot: true,
                          },
                        },
                        stat: {
                          select: {
                            name: true,
                          },
                        },
                        statOneValue: true,
                        statMaxValue: true,
                        grindIngredient: {
                          select: {
                            quantity: true,
                            item: {
                              select: {
                                name: true,
                                image: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

export type ItemRecipeWithRelations = Prisma.EquipmentStepGetPayload<{
  select: typeof itemRecipeWithRelationsSelect;
}>;
