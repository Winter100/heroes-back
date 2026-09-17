import { EnchantCategory } from '@prisma/client';

export const RedisKeys = {
  characterList: () => `chracter:list`,
  characterStatistics: () => `chracter:statistics`,
  enchantList: (category: EnchantCategory = EnchantCategory.ENCHANT) =>
    `enchant:list:${category}`,
  enchantStatistics: () => `enchant:statistics`,
  enchantSSG: () => `enchant:ssg`,
  itemList: () => `item:list`,
  itemStatistics: () => `item:statistics`,
  itemBasicForm: () => `item:basic:form`,
  recipeList: () => `recipe:list`,
  recipeSSG: () => `recipe:ssg`,
  raidList: () => `raid:list`,
  raidSSG: () => `raid:ssg`,
  raidStatistics: () => `raid:statistics`,
  partholnList: () => `partholn:list`,
} as const;
