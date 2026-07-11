import { ItemRecipeWithRelations } from '../repository/item.repository';

export class ItemRecipeMapper {
  static toResponse(recipes: ItemRecipeWithRelations[]) {
    return recipes.map((recipe) => {
      return {
        // 완성 해야 할 아이템 데이터
        name: combineItemNameAndLevel(recipe.item.name, recipe.stepName),
        level: recipe.stepName,
        image: recipe.item?.image,
        slot: recipe.item?.slot,
        effects: recipe.stats.map((stat) => ({
          stat_name: stat.stat.name,
          stat_value: stat.value,
        })),
        category: recipe.item.category.name,
        tier: recipe.item.tier.name,
        description: recipe.item.description,
        // 재료 데이터
        materials: recipe.recipesAsResult.map((material) => {
          return {
            name: combineItemNameAndLevel(
              material.materialStep?.item?.name,
              material.materialStep?.stepName,
            ),
            level: material.materialStep?.stepName,
            image: material.materialStep?.item?.image,
            option: material.description,
            effects: material.materialStep?.stats?.map((stat) => ({
              stat_name: stat.stat.name,
              stat_value: stat.value,
            })),
            description: material.materialStep?.item?.description,
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
    // 레벨이 '0' 이면 "아이템이름" 리턴
    if (level === '0') return itemName;

    // 레벨이 숫자 라면 "+레벨 아이템" 리턴
    if (!isNaN(Number(level))) return `+${level} ${itemName}`;

    // 그외 "레벨 아이템이름" 리턴
    return `${level} ${itemName}`;
  } catch {
    return itemName;
  }
};
