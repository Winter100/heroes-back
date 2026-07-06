import { ItemRecipeWithRelations } from '../repository/item.repository';

export class ItemRecipeMapper {
  static toResponse(recipes: ItemRecipeWithRelations[]) {
    return recipes.map((recipe) => ({
      name: recipe?.name,
      image: recipe?.image,
      slot: recipe?.slot,
      description: recipe?.description,
      category: recipe?.category?.name,
      tier: recipe?.tier?.name,
      materials: recipe?.recipesAsResult?.map((material) => ({
        name: material.materialItem?.name,
        image: material.materialItem?.image,
        option: material?.description,
        description: material.materialItem?.description,
        category: material.materialItem?.category.name,
        tier: material.materialItem?.tier.name,
        quantity: material.quantity,
      })),
    }));
  }
}
