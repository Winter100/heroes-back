import { EnchantWithRelations } from 'src/enchants/repository/enchant.respository';

export class EnchantMapper {
  static toResponse(enchants: EnchantWithRelations[]) {
    return enchants.map((enchant) => {
      return {
        name: enchant.name,
        rank: enchant.rank.name,
        affix: enchant.affix.value,
        // slot: getUniqueBaseStrings(
        //   enchant.enchantSlot.map((slot) => slot.slot.name),
        // ),
        slot: enchant.enchantSlot.map((slot) => ({
          name: slot.slot.name,
          value: slot.slot.value,
        })),
        effects: enchant.effects.map((effect) => ({
          stat_name: effect.stat.name,
          stat_value: effect.value,
        })),
        drop_list: enchant.enchantDrop.flatMap((drop) => {
          const result: FormattedDropResult[] = [];

          if (drop.item) {
            result.push({
              name: drop.item.name,
              image: drop.item.image,
              type: 'item',
            });
          }

          if (drop.raid) {
            result.push({
              name: drop.raid.battle,
              image: drop.raid.image,
              type: 'raid',
            });
          }

          return result;
        }),
      };
    });
  }
}

interface FormattedDropResult {
  name: string;
  image: string | null;
  type: 'item' | 'raid';
}

export function getUniqueBaseStrings(inputArray: string[]): string[] {
  const suffixRegex = /\s*\([a-zA-Z]\)$/;

  const uniqueSet = new Set<string>(
    inputArray.map((str) => str.replace(suffixRegex, '').trim()),
  );
  return Array.from(uniqueSet);
}
