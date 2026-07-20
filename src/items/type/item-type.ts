import { ItemRecipeMapper } from '../mapper/item-recipe-mapper';

export type ItemRecipeResponseArray = ReturnType<
  typeof ItemRecipeMapper.toResponse
>;

export type ItemRecipeResponse = ReturnType<
  typeof ItemRecipeMapper.toResponse
>[number];
