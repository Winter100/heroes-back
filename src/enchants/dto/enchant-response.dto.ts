import { Expose } from 'class-transformer';
import { EnchantWithRelations } from '../repository/enchant.respository';

class SlotDto {
  @Expose()
  name: string;

  @Expose()
  value: string;

  constructor(partial: EnchantWithRelations['enchantSlot'][number]) {
    this.name = partial.slot.name;
    this.value = partial.slot.value;
  }
}

class EffectDto {
  @Expose()
  stat_name: string;

  @Expose()
  stat_value: string;

  constructor(partial: EnchantWithRelations['effects'][number]) {
    this.stat_name = partial.stat.name;
    this.stat_value = partial.value;
  }
}

export class EnchantResponseDto {
  // id: number;

  @Expose()
  name: string;

  @Expose()
  rank: string;

  @Expose()
  affix: string;

  @Expose()
  slot: SlotDto[];

  @Expose()
  effects: EffectDto[];

  constructor(enchant: EnchantWithRelations) {
    this.name = enchant.name;
    this.rank = enchant.rank.name;
    this.affix = enchant.affix.name;
    this.slot = enchant.enchantSlot.map((s) => new SlotDto(s));
    this.effects = enchant.effects.map((e) => new EffectDto(e));
  }
}
