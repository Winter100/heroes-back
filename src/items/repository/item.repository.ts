import { StepsDto, UpdateItemDto } from './../dto/item-update.dto';
import { Prisma } from '@prisma/client';
import { CreateItemDto } from '../dto/item-create.dto';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto, image?: string) {
    const { categoryId, tierId } = createItemDto;
    // 트랜잭션으로 하고 private로 해야할 작업 분리해서 가져와서 사용하기
    /**
     * - 모든 장비 모두 생성 후 스탭까지만 만들기
     * - 장비 스텟
     * - 레시피
     *
     * 1. 아이템테이블에 아이템 생성
     * 2. tx.equipmentStep.create({data:{itemId:생성아이디,stepName:0}})
     *
     */
    return await this.prismaService.$transaction(async (tx) => {
      const createdItem = await tx.item.create({
        data: {
          name: createItemDto.name,
          description: createItemDto.description,
          image,
          categoryId,
          tierId,
        },
      });

      await tx.equipmentStep.create({
        data: {
          itemId: createdItem.id,
          stepName: '0',
        },
      });

      return createdItem;
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto, image?: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const updateItem = await tx.item.update({
        where: {
          id,
        },
        data: {
          name: updateItemDto.name,
          description: updateItemDto.description,
          categoryId: updateItemDto.categoryId,
          tierId: updateItemDto.tierId,
          image,
        },
      });

      // 장비 카테고리: 1
      if (updateItem.categoryId === 1) {
        const steps = updateItemDto.steps ?? [];
        const stepsDataToInsert = steps.map((step) => ({
          itemId: id,
          stepName: step.stepName,
        }));
        await tx.equipmentStep.createMany({
          data: stepsDataToInsert,
          skipDuplicates: true,
        });
        await this.createItemStatsByStep(tx, steps, id);
      }

      return updateItem;
    });
  }

  async delete(id: number) {
    await this.prismaService.item.delete({ where: { id } });
  }

  private async createItemStatsByStep(
    tx: Prisma.TransactionClient,
    steps: StepsDto[],
    itemId: number,
  ) {
    for (const step of steps) {
      const equipmentStep = await tx.equipmentStep.findUnique({
        where: {
          itemId_stepName: {
            itemId,
            stepName: step.stepName,
          },
        },
      });

      if (!equipmentStep) {
        throw new Error(
          `해당 아이템(${itemId})의 강화 단계(${step.stepName})를 찾을 수 없습니다.`,
        );
      }

      if (!step.effects || step.effects.length === 0) return;
      const statsDataToInsert = step.effects.map((effect) => ({
        statId: effect.stat_id,
        value: effect.stat_value,
        equipmentStepId: equipmentStep.id,
      }));

      await tx.itemStats.createMany({
        data: statsDataToInsert,
        skipDuplicates: true,
      });
    }
  }

  async findItemByName(itemName: string) {
    return await this.prismaService.item.findUnique({
      where: {
        name: itemName,
      },
      include: {
        category: true,
        tier: true,
      },
    });
  }
  async findItemById(id: number) {
    return await this.prismaService.item.findUnique({
      where: {
        id,
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
                        slot: true,
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
                                slot: true,
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
