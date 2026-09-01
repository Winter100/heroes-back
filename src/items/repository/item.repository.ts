import {
  itemRecipeDetailSelect,
  itemRecipeTableSelect,
} from './item-validator';
import {
  Effects,
  UpsertRecipeDto,
  UpsertStepDto,
} from './../dto/item-create.dto';
import { UpdateItemDto } from './../dto/item-update.dto';
import { Prisma } from '@prisma/client';
import { CreateItemDto } from '../dto/item-create.dto';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllItems() {
    return await this.prismaService.item.findMany({
      select: itemAllselect,
      orderBy: [
        { category: { id: 'asc' } },
        { name: 'asc' },
        { tier: { id: 'asc' } },
      ],
    });
  }

  async findAllSteps() {
    return await this.prismaService.item.findMany({
      select: itemAllStepSelect,
    });
  }

  findStepByItemIdAndStepName(itemId: number, stepName: string) {
    return this.prismaService.equipmentStep.findUnique({
      where: {
        itemId_stepName: {
          itemId,
          stepName,
        },
      },
    });
  }

  async create(createItemDto: CreateItemDto, image?: string) {
    return await this.prismaService.$transaction(async (tx) => {
      const createdItem = await tx.item.create({
        data: {
          ...createItemDto,
          image,
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

  upsertRecipe(stepId: number, createRecipeDto: UpsertRecipeDto) {
    const deleteMany = this.prismaService.itemRecipe.deleteMany({
      where: { resultId: stepId },
    });
    const createMany = this.prismaService.itemRecipe.createMany({
      data: createRecipeDto.recipes.map((recipe) => ({
        resultId: stepId,
        materialId: recipe.stepId,
        quantity: recipe.quantity,
      })),
    });
    return this.prismaService.$transaction([deleteMany, createMany]);
  }

  async update(id: number, updateItemDto: UpdateItemDto, image?: string) {
    return await this.prismaService.item.update({
      where: { id },
      data: { ...updateItemDto, image },
    });
  }

  async createStep(item: ItemWithRelations, upsertStepDto: UpsertStepDto) {
    return await this.prismaService.$transaction(async (tx) => {
      if (upsertStepDto.steps && item.category.id === 1) {
        const effects = upsertStepDto.steps.effects ?? [];
        const cratedStep = await tx.equipmentStep.create({
          data: { itemId: item.id, stepName: upsertStepDto.steps.stepName },
        });
        await this.upsertItemStatsByStep(tx, effects, cratedStep.id);
      }
    });
  }

  async updateStep(stepId: number, upsertStepDto: UpsertStepDto) {
    return await this.prismaService.$transaction(async (tx) => {
      if (upsertStepDto.steps) {
        const effects = upsertStepDto.steps.effects ?? [];
        const updatedStep = await tx.equipmentStep.update({
          where: { id: stepId },
          data: { stepName: upsertStepDto.steps.stepName },
        });
        await this.upsertItemStatsByStep(tx, effects, updatedStep.id);
      }
    });
  }
  async deleteStep(stepId: number) {
    return await this.prismaService.equipmentStep.delete({
      where: { id: stepId },
    });
  }

  async getStatsId() {
    return this.prismaService.stat.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findStatistics() {
    const [count, tier, category] = await Promise.all([
      this.prismaService.item.count(),
      this.prismaService.itemTier.findMany({
        select: {
          name: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      }),
      this.prismaService.category.findMany({
        where: {
          id: {
            notIn: [4],
          },
        },
        select: {
          name: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      }),
    ]);

    return {
      total: count,
      tiers: tier.map((s) => ({ name: s.name, count: s._count.items })),
      categories: category.map((c) => ({
        name: c.name,
        count: c._count.items,
      })),
    };
  }

  getSlots() {
    return this.prismaService.slot.findMany({
      orderBy: { id: 'asc' },
    });
  }

  getCategory() {
    return this.prismaService.category.findMany({
      orderBy: { id: 'asc' },
    });
  }

  getTier() {
    return this.prismaService.itemTier.findMany({
      orderBy: { id: 'asc' },
    });
  }

  delete(id: number) {
    return this.prismaService.item.delete({ where: { id } });
  }

  private async upsertItemStatsByStep(
    tx: Prisma.TransactionClient,
    effects: Effects[],
    equipmentStepId: number,
  ) {
    if (!equipmentStepId) {
      throw new Error(`stepId: (${equipmentStepId})를 찾을 수 없습니다.`);
    }

    if (!effects || effects.length === 0) return;
    const statsDataToInsert = effects.map((effect) => ({
      statId: effect.stat_id,
      value: effect.stat_value,
      equipmentStepId,
    }));

    await tx.itemStats.deleteMany({ where: { equipmentStepId } });

    await tx.itemStats.createMany({
      data: statsDataToInsert,
      skipDuplicates: true,
    });
  }

  async findItemByName(itemName: string) {
    return await this.prismaService.item.findUnique({
      where: {
        name: itemName,
      },
      select: itemAllselect,
    });
  }
  async findItemById(id: number) {
    return await this.prismaService.item.findUnique({
      where: {
        id,
      },
      select: itemAllselect,
    });
  }
  async findStepByStepId(id: number) {
    return await this.prismaService.equipmentStep.findUnique({
      where: {
        id,
      },
    });
  }

  async findStepByItemId(id: number) {
    return await this.prismaService.item.findUnique({
      where: {
        id,
      },
      select: itemStepSelect,
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

  // 아이템 레시피 테이블 조회
  async findItemRecipeTable() {
    return await this.prismaService.equipmentStep.findMany({
      where: itemRecipeFilter,
      select: itemRecipeTableSelect,
    });
  }

  async findItemRecipeSSG() {
    return await this.prismaService.equipmentStep.findMany({
      where: itemRecipeFilter,
      select: itemRecipeSSGWithRelationsSelect,
    });
  }

  async findItemRecipeByStepId(stepId: number) {
    return await this.prismaService.equipmentStep.findUnique({
      where: { id: stepId },
      select: itemRecipeDetailSelect,
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

const itemAllselect = Prisma.validator<Prisma.ItemSelect>()({
  id: true,
  name: true,
  image: true,
  category: true,
  tier: true,
});

export type ItemWithRelations = Prisma.ItemGetPayload<{
  select: typeof itemAllselect;
}>;

const itemStepSelect = Prisma.validator<Prisma.ItemSelect>()({
  id: true,
  name: true,
  image: true,
  description: true,
  slot: true,
  category: true,
  tier: true,
  equipmentStep: {
    select: {
      id: true,
      stepName: true,
      stats: {
        select: {
          stat: {
            select: {
              id: true,
              name: true,
            },
          },

          value: true,
        },
        orderBy: { statId: 'asc' },
      },
    },
  },
});

export type ItemStepWithRelations = Prisma.ItemGetPayload<{
  select: typeof itemStepSelect;
}>;

const itemAllStepSelect = Prisma.validator<Prisma.ItemSelect>()({
  id: true,
  name: true,
  equipmentStep: {
    select: {
      id: true,
      stepName: true,
    },
  },
});

export type ItemWithStepRelations = Prisma.ItemGetPayload<{
  select: typeof itemAllStepSelect;
}>;

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

export const itemRecipeSSGWithRelationsSelect =
  Prisma.validator<Prisma.EquipmentStepSelect>()({
    id: true,
    stepName: true,
    item: {
      select: {
        name: true,
      },
    },
  });

export type ItemRecipeSSGWithRelations = Prisma.EquipmentStepGetPayload<{
  select: typeof itemRecipeSSGWithRelationsSelect;
}>;
