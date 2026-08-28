import { Prisma } from '@prisma/client';

// 아이템 레시피 테이블 셀렉트 Part 1 - Step [아이템 레시피 테이블 1/5]
export const itemRecipeTableStepSelect_Part1 = {
  id: true,
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
} satisfies Prisma.EquipmentStepSelect;

// 아이템 레시피 테이블 셀렉트 Part 2 - Item [아이템 레시피 테이블 2/5]
export const itemRecipeTableItemSelect_Part2 = {
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
            },
          },
        },
      },
    },
  },
} satisfies Prisma.EquipmentStepSelect;

// 아이템 레시피 테이블 셀렉트 Part 3 - RecipesAsResult [아이템 레시피 테이블 3/5]
export const itemRecipeTableRecipesAsResultSelect_Part3 = {
  recipesAsResult: {
    select: {
      materialStep: {
        select: {
          _count: {
            select: {
              recipesAsResult: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.EquipmentStepSelect;

// 아이템 레시피 테이블 셀렉트 Part 4 [아이템 레시피 테이블 4/5]
export const itemRecipeTableSelect = {
  ...itemRecipeTableStepSelect_Part1,
  ...itemRecipeTableItemSelect_Part2,
  ...itemRecipeTableRecipesAsResultSelect_Part3,
} satisfies Prisma.EquipmentStepSelect;

// 아이템 레시피 테이블 타입 Part 5 [아이템 레시피 테이블 5/5]
export type ItemRecipeTableWithRelations = Prisma.EquipmentStepGetPayload<{
  select: typeof itemRecipeTableSelect;
}>;

/**
 * 구분
 */

// 아이템 레시피 상세 조회
export const itemRecipeDetailRecipesAsResultSelect_Part3 = {
  recipesAsResult: {
    select: {
      quantity: true,
      description: true,
      materialStep: {
        select: {
          _count: {
            select: {
              recipesAsResult: true,
            },
          },
          stepName: true,
          id: true,
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
} satisfies Prisma.EquipmentStepSelect;

export const itemRecipeDetailSelect = {
  ...itemRecipeTableStepSelect_Part1,
  ...itemRecipeTableItemSelect_Part2,
  ...itemRecipeDetailRecipesAsResultSelect_Part3,
} satisfies Prisma.EquipmentStepSelect;

export type ItemRecipeDetailWithRelations = Prisma.EquipmentStepGetPayload<{
  select: typeof itemRecipeDetailSelect;
}>;
