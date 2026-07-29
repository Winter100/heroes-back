import {
  EnchantFormatingType,
  ItemPriceType,
  SIMULATION_AFFIX_TYPE,
} from '../type/price-type';

export function aggregateByEnchantPreset(
  items: ItemPriceType[],
): EnchantFormatingType[] {
  const enchantMap = new Map<string, EnchantFormatingType>();

  for (const currentItem of items) {
    const enchantInfo = extractEnchantInfo(currentItem.item_option);

    if (!enchantInfo || !enchantInfo.name) continue;

    const enchantName = enchantInfo.name;
    const currentItemDate = new Date(currentItem.date_update).getTime();
    const existing = enchantMap.get(enchantName);

    if (
      !existing ||
      currentItemDate > new Date(existing.date_update).getTime()
    ) {
      enchantMap.set(enchantName, {
        item_name: enchantName,
        min_price: currentItem.min_price ?? 0,
        max_price: currentItem.max_price ?? 0,
        average_price: currentItem.average_price ?? 0,
        date_update: currentItem.date_update,
        affix: enchantInfo.affix,
      });
    }
  }

  return Array.from(enchantMap.values());
}

function extractEnchantInfo(itemOption: ItemPriceType['item_option']) {
  if (itemOption.prefix_enchant_preset_1)
    return {
      name: itemOption.prefix_enchant_preset_1.trim(),
      affix: 'PREFIX' as SIMULATION_AFFIX_TYPE,
    };
  if (itemOption.prefix_enchant_preset_2)
    return {
      name: itemOption.prefix_enchant_preset_2.trim(),
      affix: 'PREFIX' as SIMULATION_AFFIX_TYPE,
    };
  if (itemOption.suffix_enchant_preset_1)
    return {
      name: itemOption.suffix_enchant_preset_1.trim(),
      affix: 'SUFFIX' as SIMULATION_AFFIX_TYPE,
    };
  if (itemOption.suffix_enchant_preset_2)
    return {
      name: itemOption.suffix_enchant_preset_2.trim(),
      affix: 'SUFFIX' as SIMULATION_AFFIX_TYPE,
    };

  return null;
}
