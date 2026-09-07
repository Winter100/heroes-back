import { EnchantCategory } from '@prisma/client';

export const RedisKeys = {
  enchantList: (category: EnchantCategory = EnchantCategory.ENCHANT) =>
    `enchant:list:${category}`,
  recipeList: () => `recipe:list`,
  itemList: () => `item:list`,
} as const;
