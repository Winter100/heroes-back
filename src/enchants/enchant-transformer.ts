import {
  EnchantResponseDto,
  EnchantDropResponseDto,
} from './dto/enchant-response.dto';
import { EnchantWithRelations } from './repository/enchant.respository';

type GetEnchantDto<T extends { includeDrops?: boolean }> = T extends {
  includeDrops: true;
}
  ? EnchantDropResponseDto
  : EnchantResponseDto;

export class EnchantTransformer {
  static toResponseDto<T extends { includeDrops?: boolean }>(
    enchant: EnchantWithRelations,
    options: T = {} as T,
  ): GetEnchantDto<T> {
    const baseDto = new EnchantResponseDto();
    baseDto.name = enchant.name;
    baseDto.rank = enchant.rank.name;
    baseDto.affix = enchant.affix.name;
    baseDto.slot = enchant.enchantSlot.map((slot) => ({
      name: slot.slot.name,
      value: slot.slot.value,
    }));
    baseDto.effects = enchant.effects.map((effect) => ({
      stat_name: effect.stat.name,
      stat_value: effect.value,
    }));

    if (options.includeDrops) {
      const dropDto = new EnchantDropResponseDto();
      Object.assign(dropDto, baseDto);

      dropDto.drop = [
        ...enchant.enchantDrop
          .filter((drop) => drop.raid)
          .map((drop) => ({
            name: drop.raid?.battle ?? '',
            image: drop.raid?.image ?? '',
            type: 'raid' as const,
          })),
        ...enchant.enchantDrop
          .filter((drop) => drop.item)
          .map((drop) => ({
            name: drop.item?.name ?? '',
            image: drop.item?.image ?? '',
            type: 'item' as const,
          })),
      ];

      return dropDto as GetEnchantDto<T>;
    }

    return baseDto as GetEnchantDto<T>;
  }
}
