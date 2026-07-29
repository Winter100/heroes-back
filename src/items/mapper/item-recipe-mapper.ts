import { ItemRecipeWithRelations } from '../repository/item.repository';

// 아이템 내부에도 슬롯 또는 연결된 "와드네 발 방어구" 같은게 필요함.
export class ItemRecipeMapper {
  static toResponse(recipes: ItemRecipeWithRelations[]) {
    return recipes.map((recipe) => {
      const itemName = combineItemNameAndLevel(
        recipe.item.name,
        recipe.stepName,
      );

      const effects = recipe.stats.map((stat) => ({
        stat_name: stat.stat.name,
        stat_value: stat.value,
      }));

      const grinds = convertToGrindResponse(
        recipe.item?.name,
        recipe.item?.itemGrind,
        itemName,
        effects,
      );

      return {
        name: itemName,
        level: recipe.stepName,
        image: recipe.item?.image,
        slot: recipe.item?.slot,
        effects,
        grinds,
        category: recipe.item.category.name,
        tier: recipe.item.tier.name,
        description: recipe.item.description,
        sets: recipe.item.itemSetList.map((set) => {
          return {
            set_name: set.set.name,
            title: set.item.name,
            set_title: set.set.itemSetList.map((item) => item.item.name),
            slots: set.set.itemSetSlotList.map((slot) => ({
              name: slot.slot.name,
              value: slot.slot.value,
            })),
            set_options: convertSetOptions(set.set.itemSetBonus),
          };
        }),
        materials: recipe.recipesAsResult.map((material) => {
          const materialName = combineItemNameAndLevel(
            material.materialStep?.item.name,
            material.materialStep?.stepName,
          );

          const materialeffects = material.materialStep?.stats.map((stat) => ({
            stat_name: stat.stat.name,
            stat_value: stat.value,
          }));

          const materialgrinds = convertToGrindResponse(
            material.materialStep?.item?.name,
            material.materialStep?.item?.itemGrind,
            materialName,
            materialeffects,
          );

          return {
            name: materialName,
            level: material.materialStep?.stepName,
            image: material.materialStep?.item?.image,
            option: material.description,
            effects: materialeffects,
            grinds: materialgrinds,
            description: material.materialStep?.item?.description,
            sets: material.materialStep?.item.itemSetList.map((set) => {
              return {
                set_name: set.set.name,
                title: set.item.name,
                set_title: set.set.itemSetList.map((item) => item.item.name),
                slots: set.set.itemSetSlotList.map((slot) => ({
                  name: slot.slot.name,
                  value: slot.slot.value,
                })),
                set_options: convertSetOptions(set.set.itemSetBonus),
              };
            }),
            category: material.materialStep?.item?.category.name,
            tier: material.materialStep?.item?.tier.name,
            slot: material.materialStep?.item?.slot,
            quantity: material.quantity,
          };
        }),
      };
    });
  }
}

const combineItemNameAndLevel = (itemName: string, level: string) => {
  try {
    if (level === '0') return itemName;
    if (!isNaN(Number(level))) return `+${level} ${itemName}`;
    return `${level} ${itemName}`;
  } catch {
    return itemName;
  }
};

type GrindResponse = {
  title: string;
  item: GrindItemResponse[];
};

type GrindItemResponse = {
  item_slot: string[];
  item_value: GrindItemValueResponse[];
};

type GrindItemValueResponse = {
  stat_name: string;
  stat_one_value: number;
  stat_max_value: number;
  stat_value: number;
  one_ingredient: {
    name: string;
    image: string;
    quantity: number;
  }[];
};

export type RawGrindInput = {
  grind: {
    grindSlot: {
      slot: { id: number; name: string; value: string };
    }[];
    stat: { name: string };
    statOneValue: number;
    statMaxValue: number;
    grindIngredient: {
      quantity: number;
      item: { name: string; image: string | null };
    }[];
  };
}[];

function convertToGrindResponse(
  title: string,
  rawData: RawGrindInput,
  currentItemName: string = '',
  effects?: Array<{ stat_name: string; stat_value: number }>,
): GrindResponse {
  const slotGroupMap = new Map<string, GrindItemResponse>();
  const isMaxLevel = currentItemName.includes('+15');

  rawData.forEach(({ grind }) => {
    const currentSlots = grind.grindSlot.map((gs) => gs.slot.value);
    const slotKey = [...currentSlots].sort().join(',');

    const formattedIngredients = grind.grindIngredient.map((ing) => ({
      name: ing.item.name,
      image: ing.item.image ?? '',
      quantity: ing.quantity,
    }));

    // grind 내부: 파괴력은 제외하고 나머지만 MaxValue 적용
    let statValue = 0;
    if (isMaxLevel && grind.stat.name !== '파괴력') {
      statValue = grind.statMaxValue;
    }

    const newValueEntry: GrindItemValueResponse = {
      stat_name: grind.stat.name,
      stat_one_value: grind.statOneValue,
      stat_max_value: grind.statMaxValue,
      stat_value: statValue,
      one_ingredient: formattedIngredients,
    };

    if (slotGroupMap.has(slotKey)) {
      slotGroupMap.get(slotKey)!.item_value.push(newValueEntry);
    } else {
      slotGroupMap.set(slotKey, {
        item_slot: currentSlots,
        item_value: [newValueEntry],
      });
    }
  });

  // effects 업데이트 로직
  if (isMaxLevel && effects) {
    effects.forEach((effect) => {
      const matching = rawData.find(
        (g) => g.grind.stat.name === effect.stat_name,
      );

      if (matching) {
        const increaseAmount = matching.grind.statMaxValue;

        // 기본 증가
        effect.stat_value += increaseAmount;

        // "공격력" 증가 시 "마법공격력"도 함께 증가
        if (effect.stat_name === '공격력') {
          const magicEffect = effects.find((e) => e.stat_name === '마법공격력');
          if (magicEffect) {
            magicEffect.stat_value += increaseAmount;
          }
        }
      }
    });
  }

  return {
    title,
    item: Array.from(slotGroupMap.values()),
  };
}

const convertSetOptions = (data: convertStatData[]): setOptionType[] => {
  const levelMap = new Map<number, setOptionType>();

  for (const item of data) {
    const currentLevel = item.level.level;

    if (!levelMap.has(currentLevel)) {
      levelMap.set(currentLevel, {
        level: currentLevel,
        stat_bonus: [],
      });
    }

    const group = levelMap.get(currentLevel)!;
    group.stat_bonus.push({
      stat_name: item.stat.name,
      stat_value: item.statValue,
    });
  }

  return Array.from(levelMap.values()).sort((a, b) => a.level - b.level);
};

type setOptionType = {
  level: number;
  stat_bonus: { stat_name: string; stat_value: number }[];
};

type convertStatData = {
  stat: {
    name: string;
  };
  statValue: number;
  level: {
    id: number;
    level: number;
  };
};
